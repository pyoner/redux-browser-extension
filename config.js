import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    //entry: 'src/index.js',
    //dest: 'dist/bundle.js',
    format: 'iife',
    plugins: [
        buble(),
        nodeResolve({
            jsnext: true,
            main: true,
        }),
        commonjs({
            include: 'node_modules/**',
            extensions: ['.js', '.coffee'], // Default: [ '.js'  ]
            ignoreGlobal: false, // Default: false
            sourceMap: false, // Default: true
        }),
    ]
};
