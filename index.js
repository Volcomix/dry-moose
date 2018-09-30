const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const Browser = require('./lib/Browser')
const EToro = require('./lib/EToro')
const Market = require('./lib/Market')
const Filter = require('./lib/Filter')
const ProCharts = require('./lib/ProCharts')
const Chart = require('./lib/Chart')

server.listen(4000)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const browser = new Browser(io)
const eToro = new EToro(browser, io)
const market = new Market(eToro, io)
const filter = new Filter(market, io)
const proCharts = new ProCharts(browser, eToro, io)
new Chart(proCharts, filter, io)

process.on('unhandledRejection', error => {
  throw error
})
