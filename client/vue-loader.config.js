module.exports = {
    loaders: {
        css: ['vue-style-loader', {
            loader: 'css-loader',
            options: {
                minimize: true,
                sourceMap: false
            }
        }],
        scss: ['vue-style-loader', {
            loader: 'scss-loader',
            options: {
                minimize: true,
                sourceMap: false
            }
        }]
    },
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}
