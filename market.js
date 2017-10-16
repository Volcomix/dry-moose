const baseUrl = 'https://www.etoro.com'
const apiUrl = `${baseUrl}/sapi`
const apiUrlStatic = 'https://api.etorostatic.com/sapi'

class Market {
  constructor(client) {
    this.client = client
    this.requests = {}
    this.instruments = {}
    this.instrumentTypes = {}
    this.exchangeInfo = {}
    this.stocksIndustries = {}
  }

  static watch(client) {
    return new Market(client).watch()
  }

  async watch() {
    const { Network, Page } = this.client
    Network.requestWillBeSent(this.requestWillBeSent.bind(this))
    Network.loadingFinished(this.loadingFinished.bind(this))
    await Network.enable()
    await Page.enable()
    Page.navigate({ url: baseUrl })
  }

  requestWillBeSent({ requestId, request }) {
    const urls = Object.getOwnPropertyNames(Market.prototype).filter(url => (
      (url.startsWith(apiUrl) || url.startsWith(apiUrlStatic))
      && request.url.startsWith(url)
    ))

    if (urls.length > 1) {
      throw new Error(`Bad response loader URL configuration: ${request.url}`)
    } else if (urls.length === 1) {
      const url = urls[0]
      console.log(`Response loader found for request ${requestId}: ${url}`)
      this.requests[requestId] = this[url].bind(this)
    }
  }

  async loadingFinished({ requestId }) {
    const { Network } = this.client
    const loadResponse = this.requests[requestId]
    if (loadResponse) {
      console.log(`Loading response for request ${requestId}...`)
      const response = await Network.getResponseBody({ requestId })
      let body = response.body
      if (response.base64Encoded) {
        body = Buffer.from(body, 'base64').toString()
      }
      loadResponse(JSON.parse(body))
      console.log(`Response loaded for request ${requestId}.`)
    }
  }

  [`${apiUrlStatic}/candles/closingprices.json`](response) {
    this.mergeResponse(
      response,
      this.instruments,
      instrument => instrument.InstrumentId,
    )
  }

  [`${apiUrlStatic}/instrumentsmetadata/V1.1/instruments`](response) {
    this.mergeResponse(
      response.InstrumentDisplayDatas,
      this.instruments,
      displayData => displayData.InstrumentID,
    )
  }

  [`${apiUrlStatic}/trade-real/instruments`](response) {
    this.mergeResponse(
      response.Instruments,
      this.instruments,
      instrument => instrument.InstrumentID,
    )
  }

  [`${apiUrlStatic}/app-data/web-client/app-data/instruments-groups.json`](response) {
    this.mergeResponse(
      response.InstrumentTypes,
      this.instrumentTypes,
      instrumentType => instrumentType.InstrumentTypeID,
    )
    this.mergeResponse(
      response.ExchangeInfo,
      this.exchangeInfo,
      info => info.ExchangeID,
    )
    this.mergeResponse(
      response.StocksIndustries,
      this.stocksIndustries,
      stocksIndustry => stocksIndustry.IndustryID,
    )
  }

  [`${apiUrl}/trade-real/instruments/?InstrumentDataFilters`](response) {
    this.mergeResponse(
      response.Rates,
      this.instruments,
      rate => rate.InstrumentID,
    )
  }

  [`${apiUrl}/trade-real/instruments/private`](response) {
    this.mergeResponse(
      response.PrivateInstruments,
      this.instruments,
      instrument => instrument.InstrumentID,
    )
  }

  [`${apiUrl}/insights/insights/uniques`](response) {
    this.mergeResponse(
      response,
      this.instruments,
      instrument => instrument.instrumentId,
    )
  }

  mergeResponse(data, target, getId) {
    data.forEach(item => {
      const id = getId(item)
      const existing = target[id]
      if (existing) {
        Object.assign(existing, item)
      } else {
        target[id] = item
      }
    })
  }
}

module.exports = Market