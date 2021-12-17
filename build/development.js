const path = require('path');
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');
const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const portfinder = require('portfinder');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const fs = require('fs');
const _ = require('lodash');
const rm = require('rimraf');

portfinder.basePort = 8000;
portfinder.highestPort = 9000;

const options = {
  contentBase: path.resolve(__dirname, '../public'),
  hot: true,
  host: 'localhost',
  compress: false,
  open: false,
  disableHostCheck: true,
  // noInfo: true,
  overlay: true,
  // quiet: true,
  stats: {
    colors: true,
    assets: false,
    entrypoints: false,
    chunks: false,
    modules: false,
    hash: false,
    logging: 'none'
  },
  // proxy: [{
  //   context: ['/core/v5', '/storage/local', '/api/kunlun'],
  //   target: 'http://10.122.94.186',
  //   onProxyReq(proxyReq, req, res) {
  //     proxyReq.setHeader('Cookie', 'token=vRTchpGdxvKraJGUGmIewkvEQfwMhCcnbXfDcRFxSyxGpqwQOxEvFuKRQPNU;galaxy-token=vRTchpGdxvKraJGUGmIewkvEQfwMhCcnbXfDcRFxSyxGpqwQOxEvFuKRQPNU');
  //     return '';
  //   }
  // }]
};

portfinder.getPort((err, port) => {
  if (err) {
    throw err;
  } else {
    // options.port = port;构建进度条
    const WebpackBarPlugin = new WebpackBar({
      name: 'SST-FE Build Tools: development',
      color: '#2f54eb'
    });
    const errorsPlugin = new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${options.host}:${port}`],
      }
    });

    let modules = '';

    if (process.env.npm_config_module && process.env.npm_config_module !== '') {
      modules = process.env.npm_config_module;
    } else {

      const _modules = _.without(
        fs.readdirSync(path.join(__dirname, "../src/modules")),
        "layout",
        "dashboard"
      );
      modules = _modules.join(",");
    }

    let devModulesTip = `编译模块（${modules.length}）：${modules}`;

    console.log(devModulesTip);

    // 返回模块虚拟
    let buildDynamicModules = [];
    buildDynamicModules = modules.split(',').map((module, index) => {
      fs.access(path.join(`./src/modules/${module}/export.js`), function (err) {
        if (err) {
          console.log(`\n\n注意：${module} 模块不存在!\n`);
          process.exit(0);
        }
      });
      return `"${module}": require.context("@/modules/${module}", false, /export\.js$/)`
    });
    console.log(buildDynamicModules);
    const virtualModules = new VirtualModulesPlugin({
      'node_modules/vue-dynamic-modules.js': `module.exports = {${buildDynamicModules.join(',')}}`
    });
    webpackConfig.plugins.push(virtualModules);
    webpackConfig.plugins.push(WebpackBarPlugin);
    if (process.env.npm_config_nocache) {
      const CACHE_PATH = path.join(__dirname, '../node_modules/.cache');

      rm(CACHE_PATH, err => {
        if (err) {
          throw err;
        }
      });
    } else {
      webpackConfig.plugins.push(new HardSourceWebpackPlugin());
    }

    webpackDevServer.addDevServerEntrypoints(webpackConfig, options);

    const compiler = webpack(webpackConfig);
    const server = new webpackDevServer(compiler, options);

    server.listen(port, options.host);
  }
})
