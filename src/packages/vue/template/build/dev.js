'use strict';

const fs = require('fs-extra');
const home = require('home');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.dev.conf');
const portfinder = require('portfinder');
const config = require('../config');
const utils = require('./utils')
const exec = require('child_process').exec;

function  startPlatform(){
    var cmd='cd '+ home.resolve('~') + '/.kazma/dev && npm run start';
    exec(cmd, function(error, stdout, stderr) {
        if(error){
            console.log(error);
            process.exit(0);
        }
    });
}
portfinder.basePort = process.env.PORT || config.dev.port;
portfinder.getPort((err, port) => {
    if (err) {
      console.log('获取端口错误,请重新尝试');
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      webpackConfig.devServer.port = port

        const compiler = Webpack(webpackConfig);
        
        const devServerOptions = Object.assign({}, webpackConfig.devServer, {
        stats: {
            colors: true
        }
        });
        const server = new WebpackDevServer(compiler, devServerOptions);

        server.listen(port, webpackConfig.devServer.host, (err) => {
            if(err) utils.createNotifierCallback();
            if(process.env.NODE_ENV === 'kazma') { 
                fs.readJSON('kazma.config.json','utf8',function (err, data) {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    data.host = webpackConfig.devServer.host;
                    data.port = webpackConfig.devServer.port;
                    data.url =  `http://${webpackConfig.devServer.host}:${port}`;
                    fs.writeJSON('kazma.config.json',data,{spaces:2})
                    let tmpFile = home.resolve(`~/.kazma/kazma.config.json`);
                    fs.removeSync(tmpFile);
                    fs.ensureFile(tmpFile).then(()=>{
                        return fs.writeJSON(tmpFile,data,{spaces:2});
                    }).then(()=>{
                        startPlatform();
                    })
                    
                });
            } else {
                console.log(`Your application is running here: http://${webpackConfig.devServer.host}:${port}`);
            }

        });
    }
});
