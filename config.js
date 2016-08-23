var buble = require('rollup-plugin-buble');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var builtins = require('rollup-plugin-node-builtins');
var globals = require('rollup-plugin-node-globals');

var config = {
    //entry: 'src/index.js',
    //dest: 'dist/bundle.js',
    format: 'iife',
    plugins: [
        buble(),
        builtins(),
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs({
            include: 'node_modules/**',
            exclude: 'node_modules/rollup-plugin-node-globals/**',
            extensions: ['.js', '.coffee'], // Default: [ '.js'  ]
            ignoreGlobal: true, // Default: false
            sourceMap: false, // Default: true
        }),
        globals(),
    ]
};

module.exports = config;
