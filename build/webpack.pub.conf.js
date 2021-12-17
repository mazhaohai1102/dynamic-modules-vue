/*
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-11-11 19:37:40
 * @LastEditors: martin
 * @LastEditTime: 2021-12-16 14:30:24
 */
"use strict";
const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const baseWebpackConfig = require('./webpack.base.conf');
const ESBuildPlugin = require('esbuild-minimizer-webpack-plugin').default;
const fs = require("fs");
const _ = require("lodash");
const systemSource = "DynamicModules";
const webpackConfigs = [];

const buildModuleEntry = moduleName => {
    const entry = {};
    entry[`${moduleName}AsyncModule`] = `./src/modules/${moduleName}/export.js`;
    return entry;
};

const buildModuleWebpackConfig = moduleName => {
    const moduleFileName = `${moduleName}-${systemSource}`;
    const config = {
        mode: "production",
        entry: buildModuleEntry(moduleName),
        output: {
            path: path.resolve(__dirname, "../dist"),
            filename: `${moduleFileName}/${_.camelCase(moduleName)}AsyncModule.js`,
            // 路由懒加载
            chunkFilename: `${moduleFileName}/[name].[chunkhash:5].js`,
            library: `${_.camelCase(moduleName)}AsyncModule`
        },
        resolve: {
          extensions: ['.js', '.vue', '.json', '.svg'],
          alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, '../src')
          },
          // symlinks: false
          // modules: [
          //   'node_modules'
          // ]
        },
        optimization: {
            namedChunks: true,
            minimize: true,
            minimizer: [
                new ESBuildPlugin()
            ]
        }
    };
    return merge.strategy({
        'module.rules': 'replace'
    })(baseWebpackConfig, config)
};

const moduleNames = _.without(
    fs.readdirSync(path.join(__dirname, "../src/modules")),
    "layout",
    "dashboard"
);

moduleNames.forEach(moduleName => {
    const config = buildModuleWebpackConfig(moduleName);
    webpackConfigs.push(config);
});

module.exports = webpackConfigs;