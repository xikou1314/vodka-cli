const path = require('path'); //导入路径模块
const fs = require('fs-extra'); //文件读写
const webpack = require('webpack'); //导入webpack
const config = require('./config'); //导入默认配置
const helper = require('./helper'); //导入路径帮助方法
const glob = require('glob'); //获取文件
const vueLoaderConfig = require('./vue-loader.conf'); //导入vue-loader的默认配置
const vueWebTemp = helper.rootNode(config.templateDir); //获得本地环境的暂存目录
const weexEntry = {
  'index': helper.root('entry.js') //入口js文件
}
//获得入口文件的内容
const getEntryFileContent = (source, routerpath) => {
  let dependence = `import Vue from 'vue'\n`;       //添加导入vue的import命令
  dependence += `import weex from 'weex-vue-render'\n`; //添加导入weex的import命令
  let entryContents = fs.readFileSync(source).toString(); //读取文件并转换为string字符串
  entryContents = dependence + entryContents; //将依赖拼接到文件字符串中
  entryContents = entryContents.replace(/\/\* weex initialized/, match => `weex.init(Vue)\n${match}`);
                  //将weex initialized字符串替换为 weex.init(vue)命令 并提示初始化完成
  return entryContents;
}
//获得路由文件的内容
const getRouterFileContent = (source) => {
  const dependence = `import Vue from 'vue'\n`;
  let routerContents = fs.readFileSync(source).toString();
  routerContents = dependence + routerContents;
  return routerContents;
}
//获得入口文件
const getEntryFile = () => {
  //根据暂存文件夹和entry的相对路径，获得entry.js的路径
  const entryFile = path.join(vueWebTemp, config.entryFilePath)
  //获得路由文件的路径
  const routerFile = path.join(vueWebTemp, config.routerFilePath)
  //读取缓存文件 获得文件内容 进行处理 并将文件吐回原位置
  fs.outputFileSync(entryFile, getEntryFileContent(helper.root(config.entryFilePath), routerFile));
  fs.outputFileSync(routerFile, getRouterFileContent(helper.root(config.routerFilePath)));
  //返回入口文件的路径
  return {
    index: entryFile
  }
}

// The entry file for web needs to add some library. such as vue, weex-vue-render
// 1. src/entry.js 
// import Vue from 'vue';
// import weex from 'weex-vue-render';
// weex.init(Vue);
// 2. src/router/index.js
// import Vue from 'vue'
const webEntry = getEntryFile();


//创建lint规则
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [helper.rootNode('src'), helper.rootNode('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})
//根据配置中设置的useEslint来决定是否启用eslint
const useEslint = config.dev.useEslint ? [createLintingRule()] : []

/**
 * Plugins for webpack configuration.
 */
//导入webpack的插件
const plugins = [
  /*
   * Plugin: BannerPlugin
   * Description: Adds a banner to the top of each generated chunk.
   * See: https://webpack.js.org/plugins/banner-plugin/
   */
  //为每个生成的chunk(打包出来的代码块)添加头表示
  new webpack.BannerPlugin({
    banner: '// { "framework": "Vue"} \n',
    raw: true,
    exclude: 'Vue'
  })
];

// Config for compile jsbundle for web.
const webConfig = {
  entry: Object.assign(webEntry, {
    'vendor': [path.resolve('node_modules/phantom-limb/index.js')]
  }), //vendor依赖的第三方库 不会经常变更
  output: {
    path: helper.rootNode('./dist'),
    filename: '[name].web.js'
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.js', '.vue', '.json'], //引入时自动解析的扩展名
    alias: {
      '@': helper.resolve('src')  //创建 import 或 require 的别名，来确保模块引入变得更简单
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  //模块配置 各种Loader
  module: {
    // webpack 2.0 
    rules: useEslint.concat([
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: config.excludeModuleReg
      },
      {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'vue-loader',
          options: Object.assign(vueLoaderConfig({useVue: true, usePostCSS: false}), {
            /**
             * important! should use postTransformNode to add $processStyle for
             * inline style prefixing.
             */
            optimizeSSR: false,
            postcss: [
              // to convert weex exclusive styles.
              require('postcss-plugin-weex')(),
              require('autoprefixer')({
                browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
              }),
              require('postcss-plugin-px2rem')({
                // base on 750px standard.
                rootValue: 75,
                // to leave 1px alone.
                minPixelValue: 1.01
              })
            ],
            compilerModules: [
              {
                postTransformNode: el => {
                  // to convert vnode for weex components.
                  require('weex-vue-precompiler')()(el)
                }
              }
            ]
            
          })
        }],
        exclude: config.excludeModuleReg
      }
    ])
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins
};
// Config for compile jsbundle for native.
const weexConfig = {
  entry: weexEntry,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  /**
   * Options affecting the resolving of modules.
   * See http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': helper.resolve('src')
    }
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: config.excludeModuleReg
      },
      {
        test: /\.vue(\?[^?]+)?$/,
        use: [{
          loader: 'weex-loader',
          options: vueLoaderConfig({useVue: false})
        }],
        exclude: config.excludeModuleReg
      }
    ]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins,
  /*
  * Include polyfills or mocks for various node stuff
  * Description: Node configuration
  *
  * See: https://webpack.github.io/docs/configuration.html#node
  */
  node: config.nodeConfiguration
};

module.exports = [webConfig, weexConfig];
