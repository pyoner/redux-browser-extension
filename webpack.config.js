var path = require('path');
var RemoveWebpackPlugin = require('remove-webpack-plugin');
var CopyWepbackPlugin = require('copy-webpack-plugin');


var BUILD_DIR = path.join(__dirname, './build');
var BUILD_SRC_DIR = path.join(BUILD_DIR, 'src');
var BUILD_ASSETS_DIR = path.join(BUILD_DIR, 'assets');

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
        new CopyWepbackPlugin([
            { from: './assets/**', to: BUILD_ASSETS_DIR },
            { from: 'manifest.json', to: BUILD_DIR }
        ])
    ]
}

module.exports = config;
