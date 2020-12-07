'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var tsImportPluginFactory = require('ts-import-plugin');
module.exports = {
    configureWebpack: function configureWebpack(config) {
        // 使用ts-important-plugin 动态引入vant 
        config.module = {
            rules: [].concat(_toConsumableArray(config.module.rules), [{
                test: /\.(jsx|tsx|js|ts)$/,
                loader: 'ts-loader',
                options: {
                    happyPackMode: true, // 打包相关
                    transpileOnly: true,
                    getCustomTransformers: function getCustomTransformers() {
                        return {
                            before: [tsImportPluginFactory({
                                libraryName: 'vant',
                                libraryDirectory: 'es',
                                style: function style(name) {
                                    return name + '/style/less';
                                } // 配置vant主题文件
                            })]
                        };
                    },
                    compilerOptions: {
                        module: 'es2015'
                    }
                },
                exclude: /node_modules/
            }])
        };
    },
    lintOnSave: true,
    css: {

        loaderOptions: {

            postcss: {

                plugins: [require('postcss-pxtorem')({

                    rootValue: 37.5, // 换算的基数

                    propList: ['*']

                })]

            }

        }

    }
};