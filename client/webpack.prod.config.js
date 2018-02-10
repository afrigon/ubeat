const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: [
        path.join(__dirname, 'main.js')
    ],
    output: {
        filename: '[name].min.js',
        path: path.join(__dirname, '..', 'dist', 'js'),
        publicPath: '/dist/js'
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
                    css: {
                        loader: 'vue-style-loader!css-loader',
                        options: { minimized: true, sourceMap: false }
                    },
                    scss: {
                        loader: 'vue-style-loader!css-loader!sass-loader',
                        options: { minimized: true, sourceMap: false }
                    }
                }
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: __dirname
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('common'),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ]
}
