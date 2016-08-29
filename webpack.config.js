var path = require('path');

var config = {
    entry: {
        background: './src/background.js',
        content: './src/content.js',
    },
    output: {
        filename: '[name].js',
        path: './build/src',
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
    }
}

module.exports = config;
