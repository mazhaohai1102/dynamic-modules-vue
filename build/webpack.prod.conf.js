/*
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-09-26 18:59:13
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 11:08:12
 */
'use strict'

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const vueLoaderConfig = require('./vue-loader.conf');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json');
const pkgLock = require('../package-lock.json');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const ESBuildPlugin = require('esbuild-minimizer-webpack-plugin').default;

const appDir = '';

const webpackConfig = {
  mode: 'production',
  entry: {
    app: ['./src/main.js']
  },
  output: {
    path: path.resolve(__dirname, `../dist/${appDir}`),
    filename: 'js/[name].[chunkhash:5].js',
    // 路由懒加载
    chunkFilename: 'js/[name].[chunkhash:3].js',
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.svg'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      'consola': 'consola/dist/consola.browser',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:3].css",
      // chunkFilename: "css/[name].[contenthash:3].css"
    }),
    new OptimizeCssAssetsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        // to: 'static',
        toType: 'dir',
        ignore: [
          '.DS_Store'
        ]
      }
    ]),
    // new WebpackBar({
    //   name: 'SST-FE Build Tools',
    //   color: '#2f54eb'
    // })
  ],
  optimization: {
    namedChunks: true,
    minimize: true,
    minimizer: [
      new ESBuildPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }
};
module.exports =merge(baseWebpackConfig, webpackConfig);
