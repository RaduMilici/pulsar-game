const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

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
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      app3D: resolve('src', 'App3D', 'globalInstance'),
      src: resolve('src'),
      components: resolve('src', 'components'),
      entities: resolve('src', 'entities'),
      types: resolve('src', 'types'),
      util: resolve('src', 'util'),
      const: resolve('src', 'const'),
      nav: resolve('src', 'nav'),
      skills: resolve('src', 'entities', 'character', 'skills'),
      character: resolve('src', 'entities', 'character')
    }
  },
  output: {
    filename: 'bundle.js',
    path: resolve('dist')
  },
  plugins: [
    new VueLoaderPlugin(),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
    }),
    new webpack.ProvidePlugin({ app3D: 'app3D' })
  ]
};