const config = require('./config')
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const proxy = require('http-proxy-middleware')

if (process.argv.indexOf('-p') !== -1) {
    app.use('/js', express.static(path.join('.', 'dist', 'js')))
    app.get('/', (req, res) => {
        return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })
} else {
    const webpack = require('webpack')
    const webpackDev = require('webpack-dev-middleware')
    const webpackHot = require('webpack-hot-middleware')
    const webpackConfig = require(path.join(__dirname, 'src', 'webpack.config'))
    const compiler = webpack(webpackConfig)

    app.use(webpackDev(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true }
    }))
    app.use(webpackHot(compiler))
    compiler.plugin('compilation', (compilation) => {
        compilation.plugin('html-webpack-plugin-after-emit', (data, callback) => {
            webpackHot.publish({ action: 'reload' })
            callback()
        })
    })
}

app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/static', express.static(path.join('.', 'static')))

app.get('/album', (req, res) => { return res.redirect('/#/album') })
app.get('/artist', (req, res) => { return res.redirect('/#/artist') })

app.use('/api', proxy({
    target: 'https://ubeat.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {'^/api' : ''},
    logLevel: 'warn'
}))

server.listen(config.port, config.ip)
