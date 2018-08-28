const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const Browser = require('./lib/browser')
const EToro = require('./lib/etoro')

server.listen(4000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const browser = new Browser(io)
new EToro(browser, io)

process.on('unhandledRejection', error => {
  throw error
})
