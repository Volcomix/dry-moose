const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const Browser = require('./lib/browser')

server.listen(4000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

new Browser(io)
