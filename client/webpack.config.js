const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.config')
const sourceDir = path.join(__dirname, 'src')

module.exports = {
    entry: {
        app: path.join(sourceDir, 'main.js')
    },
    output: {
        filename: 'app.min.js',
        path: path.join(__dirname, 'build', 'js'),
        publicPath: '/js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        symlinks: false,
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': sourceDir
        }
    },
    module: {
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: sourceDir
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: sourceDir
        }]
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'build', '/index.html'),
            template: path.join(sourceDir, '/index.html'),
            inject: true
        })
    ]
}
