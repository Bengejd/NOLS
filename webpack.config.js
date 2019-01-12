const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  plugins: [
    new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),
  ],
  optimization: {
    minimizer: [new TerserPlugin(
      {
        parallel: 5,
        sourceMap: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: {
            comments: false,
          },
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }
    )
    ],
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
	      use: {
		      loader: 'babel-loader',
		      options: {
			      presets: ['@babel/preset-env']
		      }
	      }
      }
    ]
  }
};