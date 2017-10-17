var path = require('path');
var webpack = require('webpack');
var RemoveWebpackPlugin = require('remove-webpack-plugin');
var CopyWepbackPlugin = require('copy-webpack-plugin');
var Bump = require("bump-webpack-plugin");


var BUILD_DIR = path.join(__dirname, './build');
var SRC_DIR = path.join(__dirname, 'src');

var config = {
    entry: {
        background: './src/background.js',
        content: './src/content.js'
    },
    output: {
        filename: '[name].js',
        path: BUILD_DIR,
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    node: {
        fs: 'empty',
    },
    module: {
        loaders: [{
                test: /\.css$/,
                loader: 'css-loader',
            },
            {
                test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'base64-inline-loader',
                query: {
                    name: '[name].[ext]',
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                //include: SRC_DIR,
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: SRC_DIR,
                query: {
                    presets: [
                        'es2015',
                        'stage-1',
                        'react',
                    ],
                    plugins: [
                        'transform-unicode-property-regex',
                        'transform-runtime',
                        'closure-elimination',
                    ]
                }
            }
        ]
    },
    plugins: [
        new RemoveWebpackPlugin(['./build']),
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                ascii_only: true,
            },
        })
    ])
} else {
    config.plugins = [
        new Bump(['package.json', 'manifest.json']),
    ].concat(config.plugins)
}

module.exports = config;
