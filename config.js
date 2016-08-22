import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
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
