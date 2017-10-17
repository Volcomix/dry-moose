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
    console.log('Loading market...')
    this.initPromises()
    Network.requestWillBeSent(this.requestWillBeSent.bind(this))
    Network.loadingFinished(this.loadingFinished.bind(this))
    await Network.enable()
    await Page.enable()
    await Page.navigate({ url: baseUrl })
    await Promise.all([
      Promise.all(
        Object.keys(this.loadersPromises)
          .map(url => this.loadersPromises[url].promise)
      ).then(this.marketPromise.resolve),
      this.marketPromise.promise
    ])
    console.log('Market loaded.')
  }

  initPromises() {
    this.marketPromise = {}
    this.marketPromise.promise = new Promise((resolve, reject) => {
      this.marketPromise.resolve = resolve
      this.marketPromise.reject = reject
    })
    this.loadersPromises = this.loadersUrls()
      .reduce((promises, url) => {
        const promise = {}
        promise.promise = new Promise((resolve, reject) => {
          promise.resolve = resolve
          promise.reject = reject
        })
        promises[url] = promise
        return promises
      }, {})
  }

  requestWillBeSent({ requestId, request }) {
    try {
      const urls = this.loadersUrls()
        .filter(url => request.url.startsWith(url))
      if (urls.length > 1) {
        throw new Error(`Bad response loader URL configuration: ${request.url}`)
      } else if (urls.length === 1) {
        const url = urls[0]
        this.requests[requestId] = url
      }
    } catch (error) {
      this.marketPromise.reject(error)
    }
  }

  async loadingFinished({ requestId }) {
    try {
      const { Network } = this.client
      const url = this.requests[requestId]
      if (url) {
        const response = await Network.getResponseBody({ requestId })
        let body = response.body
        if (response.base64Encoded) {
          body = Buffer.from(body, 'base64').toString()
        }
        this[url](JSON.parse(body))
        console.log(`Response loaded: ${url}`)
        this.loadersPromises[url].resolve()
      }
    } catch (error) {
      this.marketPromise.reject(error)
    }
  }

  loadersUrls() {
    return Object.getOwnPropertyNames(Market.prototype)
      .filter(url => url.startsWith(apiUrl) || url.startsWith(apiUrlStatic))
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