const EventEmitter = require('events')

const JsonNormalizer = require('./json-normalizer')

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
      const json = await response.json()
      const normalized = JsonNormalizer.normalize(json)
      this[`receive${name}`](normalized)
    }
  }

  receiveClosingPrices(response) {
    this.receive('closingPrices', response)
  }

  receiveDisplayDatas(response) {
    this.receive('displayDatas', response.instrumentDisplayDatas)
  }

  receiveInstruments(response) {
    this.receive('instruments', response.instruments)
  }

  receiveGroups(response) {
    this.receive('instrumentTypes', response.instrumentTypes)
    this.receive('exchangeInfo', response.exchangeInfo)
    this.receive('stocksIndustries', response.stocksIndustries)
  }

  receiveActivity(response) {
    const activityStates = response.instrumentsToActivityState
    this.receive('activityStates', Object.keys(activityStates).map(
      instrumentId => ({
        instrumentId: +instrumentId,
        activityState: activityStates[instrumentId],
      })
    ))
    this.receive('rates', response.rates)
  }

  receivePrivateInstruments(response) {
    this.receive('privateInstruments', response.privateInstruments)
  }

  receiveInsights(response) {
    this.receive('insights', response)
  }

  receive(name, data) {
    this.emit('data', name, data)
  }
}

module.exports = Sniffer