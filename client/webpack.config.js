const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    entry: [
        'babel-polyfill',
        'webpack-hot-middleware/client',
        path.join(__dirname, 'main-dev.js')
    ],
    output: {
        filename: 'app.js',
        path: '/',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        symlinks: false,
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': __dirname
        }
    },
    module: {
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: __dirname
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: 'vue-style-loader!css-loader',
                    scss: 'vue-style-loader!css-loader!sass-loader'
                }
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: __dirname
        }]
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({ 'process.env': "'development'" }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: path.join('index.html'),
            template: path.join('client', 'index.html'),
            inject: true
        })
    ]
}
