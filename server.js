const config = require('./config')
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')

if (!process.env.NODE_ENV) { process.env.NODE_ENV = config.NODE_ENV }

app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/static', express.static('./client/static'))
app.use('/js', express.static('./client/build/js'))

app.get('/album', (req, res) => { return res.redirect('/#/album') })
app.get('/artist', (req, res) => { return res.redirect('/#/artist') })
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

server.listen(process.env.port || config.port, '0.0.0.0')
