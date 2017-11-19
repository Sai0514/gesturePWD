import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify'

export default {
    input: 'src/js/main.js',
    output: {
        file: 'dist/js/bundle.min.js',
        format: 'iife'
    },
    sourceMap: true,
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ]
}