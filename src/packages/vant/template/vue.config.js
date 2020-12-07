const tsImportPluginFactory = require('ts-import-plugin');
module.exports = {
    configureWebpack: (config) => {
        // 使用ts-important-plugin 动态引入vant 
        config.module = {
            rules: [
            // 配置新的 使用config的话 必须要将原来的和现在的合并,而且使用新的在后面覆盖旧的
            ...config.module.rules,
            {
                test: /\.(jsx|tsx|js|ts)$/,
                loader: 'ts-loader',
                options: {
                happyPackMode: true, // 打包相关
                transpileOnly: true,
                getCustomTransformers: () => ({
                    before: [ tsImportPluginFactory( {
                    libraryName: 'vant',
                    libraryDirectory: 'es',
                    style: name => `${name}/style/less` // 配置vant主题文件
                    })]
                }),
                compilerOptions: {
                    module: 'es2015'
                }
                },
                exclude: /node_modules/
            }
            ]
        }
    },
    lintOnSave: true,
    css: {

        loaderOptions: {

            postcss: {

                plugins: [

                    require('postcss-pxtorem')({

                        rootValue : 37.5, // 换算的基数

                        propList  : ['*'],

                    }),

                ]

            }

        }

    },
  }