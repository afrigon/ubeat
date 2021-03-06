const path = require('path')
const cors = require('cors')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const favicon = require('serve-favicon')
const proxy = require('http-proxy-middleware')
const radio = require('./radio')
let config = require('./config')
const sharedConfig = config.shared

if (process.argv.indexOf('-p') !== -1) {
    config = config.prod
    app.use('/js', express.static(path.join(__dirname, 'dist', 'js')))
    app.get('/', (req, res) => {
        return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })
} else {
    config = config.dev
    const webpack = require('webpack')
    const webpackDev = require('webpack-dev-middleware')
    const webpackHot = require('webpack-hot-middleware')
    const webpackConfig = require(path.join(__dirname, 'client', 'webpack.config'))
    const compiler = webpack(webpackConfig)

    app.use(webpackDev(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true }
    }))
    app.use(webpackHot(compiler))
    compiler.plugin('compilation', (compilation) => {
        return compilation.plugin('html-webpack-plugin-after-emit', (data, callback) => {
            webpackHot.publish({ action: 'reload' })
            return callback()
        })
    })
}

app.disable('x-powered-by')
app.use(cors({
    origin: '*',
    methods: ['GET'],
    credentials: true
}))
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')))
app.use('/radio', radio)
app.use('/static', express.static(path.join('.', 'static')))
app.use('/api', proxy({
    target: sharedConfig.api,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logLevel: 'warn'
}))
app.all('/*', (req, res) => res.redirect(`/#${req.originalUrl}`))

server.listen(config.port, config.ip)
