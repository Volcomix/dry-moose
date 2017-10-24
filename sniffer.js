const EventEmitter = require('events')

const urlApi = 'https://www.etoro.com/sapi'
const urlApiStatic = 'https://api.etorostatic.com/sapi'

const urls = {
  ClosingPrices: `${urlApiStatic}/candles/closingprices.json`,
  DisplayDatas: `${urlApiStatic}/instrumentsmetadata/V1.1/instruments`,
  Instruments: `${urlApiStatic}/trade-real/instruments?InstrumentDataFilters`,
  Groups: `${urlApiStatic}/app-data/web-client/app-data/instruments-groups.json`,
  Activity: `${urlApi}/trade-real/instruments/?InstrumentDataFilters`,
  PrivateInstruments: `${urlApi}/trade-real/instruments/private?InstrumentDataFilters`,
  Insights: `${urlApi}/insights/insights/uniques`,
}

class Sniffer extends EventEmitter {
  sniff(page) {
    page.on('response', this.receiveResponse.bind(this))
  }

  async receiveResponse(response) {
    const request = response.request()
    const name = Object.keys(urls).find(
      name => request.url.startsWith(urls[name])
    )
    if (name) {
      this[`receive${name}`](await response.json())
    }
  }

  receiveClosingPrices(response) {
    this.emit('closingPrices', response)
  }

  receiveDisplayDatas(response) {
    this.emit('displayDatas', response.InstrumentDisplayDatas)
  }

  receiveInstruments(response) {
    this.emit('instruments', response.Instruments)
  }

  receiveGroups(response) {
    this.emit('instrumentTypes', response.InstrumentTypes)
    this.emit('exchangeInfo', response.ExchangeInfo)
    this.emit('stocksIndustries', response.StocksIndustries)
  }

  receiveActivity(response) {
    this.emit('activityStates', response.InstrumentsToActivityState)
    this.emit('rates', response.Rates)
  }

  receivePrivateInstruments(response) {
    this.emit('privateInstruments', response.PrivateInstruments)
  }

  receiveInsights(response) {
    this.emit('insights', response)
  }
}

module.exports = Sniffer