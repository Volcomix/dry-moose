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
    this.receive('closingPrices', response)
  }

  receiveDisplayDatas(response) {
    this.receive('displayDatas', response.InstrumentDisplayDatas)
  }

  receiveInstruments(response) {
    this.receive('instruments', response.Instruments)
  }

  receiveGroups(response) {
    this.receive('instrumentTypes', response.InstrumentTypes)
    this.receive('exchangeInfo', response.ExchangeInfo)
    this.receive('stocksIndustries', response.StocksIndustries)
  }

  receiveActivity(response) {
    const activityStates = response.InstrumentsToActivityState
    this.receive('activityStates', Object.keys(activityStates).map(
      InstrumentId => ({
        InstrumentId,
        ActivityState: activityStates[InstrumentId],
      })
    ))
    this.receive('rates', response.Rates)
  }

  receivePrivateInstruments(response) {
    this.receive('privateInstruments', response.PrivateInstruments)
  }

  receiveInsights(response) {
    this.receive('insights', response)
  }

  receive(name, data) {
    this.emit('data', name, data)
  }
}

module.exports = Sniffer