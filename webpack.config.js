var path = require('path');
var webpack = require('webpack');
var RemoveWebpackPlugin = require('remove-webpack-plugin');
var CopyWepbackPlugin = require('copy-webpack-plugin');
var Bump = require("bump-webpack-plugin");


var BUILD_DIR = path.join(__dirname, './build');
var BUILD_SRC_DIR = path.join(BUILD_DIR, 'src');

var config = {
    entry: {
        background: './src/background.js',
        content: './src/content.js',
    },
    output: {
        filename: '[name].js',
        path: BUILD_SRC_DIR,
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'src'),
            query: {
                presets: [
                    'es2015',
                ]
            }
        }]
    },
    plugins: [
        new RemoveWebpackPlugin(['./build']),
        new Bump(['package.json', 'manifest.json']),
        new CopyWepbackPlugin([
            { from: './assets/**', to: BUILD_DIR },
            { from: 'manifest.json', to: BUILD_DIR }
        ])
    ]
}
if (process.env.NODE_ENV == 'production') {
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': { 'NODE_ENV': JSON.stringify('production') }
        }),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: true } })
    ])
}

module.exports = config;
