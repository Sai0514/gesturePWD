import babel from 'rollup-plugin-babel';


export default {
    input: 'src/js/main.js',
    format: 'iife',
    dest: 'dist/js/bundle.js', //等价于 --output，打包目标文件
    sourceMap: true, //启用sourcemap
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
};