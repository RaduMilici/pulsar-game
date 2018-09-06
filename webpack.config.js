const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const resolve = (...args) => path.resolve(__dirname, ...args);

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'bundle.js',
        path: resolve('dist')
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};