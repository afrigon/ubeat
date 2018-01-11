const config = require('./config')
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')

if (!process.env.NODE_ENV) { process.env.NODE_ENV = config.NODE_ENV }

app.set('json spaces', 4)
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(history())
app.use('/static', express.static('./client/static'))
app.use('/js', express.static('./client/build/js'))

app.get('/yolo', (req, res) => {
    return res.send('yolo')
})

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

server.listen(process.env.port || config.port, '0.0.0.0')
