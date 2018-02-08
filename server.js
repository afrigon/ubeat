const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const proxy = require('http-proxy-middleware')
let config = require('./config')

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
    const webpackConfig = require(path.join(__dirname, 'views', 'webpack.config'))
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')))
app.use('/static', express.static(path.join('.', 'static')))
app.use('/api', proxy({
    target: 'https://ubeat.herokuapp.com',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logLevel: 'warn'
}))

app.get('/album', (req, res) => { return res.redirect('/#/album') })
app.get('/artist', (req, res) => { return res.redirect('/#/artist') })

app.get('/login', (req, res) => {
    return res.send('login')
})

app.get('/radio/:genre', (req ,res) => {
    return res.json({
        link: 'https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview127/v4/9d/91/a0/9d91a04c-f41a-f605-8ca8-71821a1f69d2/mzaf_1381500230730914803.plus.aac.p.m4a',
        time: 10
    })
})

// res.cookie('access_token', 'abc', {
//     maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
//     // secure: true
// })

app.get('/logout', (req, res) => {
    return res.clearCookie('access_token') & res.redirect('/login')
})

server.listen(config.port, config.ip)
