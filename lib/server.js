const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(4000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

exports.io = io
