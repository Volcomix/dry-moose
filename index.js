const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const Browser = require('./lib/browser')
const EToro = require('./lib/etoro')
const Market = require('./lib/market')
const Filter = require('./lib/filter')
const ProCharts = require('./lib/procharts')

server.listen(4000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const browser = new Browser(io)
const eToro = new EToro(browser, io)
const market = new Market(eToro, io)
new Filter(market, io)
new ProCharts(browser, eToro, io)

process.on('unhandledRejection', error => {
  throw error
})
