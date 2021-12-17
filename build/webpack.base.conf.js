'use strict'
const webpack = require('webpack');
const path = require('path');
const vueLoaderConfig = require('./vue-loader.conf');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const noCache = process.env.npm_config_nocache;

module.exports = {
  entry: [],
  output: {
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.svg'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [
      //     path.resolve(__dirname, "../src")
      //   ],
      //   options: {
      //     // formatter: require('eslint-friendly-formatter'),
      //     emitWarning: true,
      //     failOnWarning: false,
      //     failOnError: true,
      //     cache: process.env.NODE_ENV === 'development' && !noCache ? true : false
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)&&
          !/sst-fe-base-theme/.test(file) // 处理依赖的color.js解析问题
        ),
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: process.env.NODE_ENV === 'development' && !noCache ? true : false
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              // additionalData: `@import "~@/scss/theme-default/var.scss";`,
              implementation: require('sass'),
              sassOptions: {
                fiber: false
                // indentedSyntax: true // optional
              },
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[hash:5].[ext]',
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash:5].[ext]'
        }
      },
      {
        test: /\.(exe|pdf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'files/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
