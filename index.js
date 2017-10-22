const puppeteer = require('puppeteer')
const MongoClient = require('mongodb').MongoClient

const chromeOptions = {
  executablePath: 'google-chrome-stable',
  userDataDir: '/home/volcomix/.config/google-chrome',
}

const mongoUri = 'mongodb://localhost:27017/drymoose'

const urlBase = 'https://www.etoro.com'
const urlApi = `${urlBase}/sapi`
const urlApiStatic = 'https://api.etorostatic.com/sapi'

const urlClosingPrices = `${urlApiStatic}/candles/closingprices.json`
const urlDisplayDatas = `${urlApiStatic}/instrumentsmetadata/V1.1/instruments`
const urlInstruments = `${urlApiStatic}/trade-real/instruments?InstrumentDataFilters`
const urlGroups = `${urlApiStatic}/app-data/web-client/app-data/instruments-groups.json`
const urlActivity = `${urlApi}/trade-real/instruments/?InstrumentDataFilters`
const urlPrivate = `${urlApi}/trade-real/instruments/private?InstrumentDataFilters`
const urlInsights = `${urlApi}/insights/insights/uniques`

class DryMoose {
  async run() {
    try {
      const browser = await puppeteer.launch({ appMode: true, ...chromeOptions })
      this.db = await MongoClient.connect(mongoUri)
      await this.db.collection('executions').insertOne({
        date: new Date(),
        event: 'start',
      })
      const page = await browser.newPage()
      page.on('response', this.receiveResponse.bind(this))
      await page.goto(urlBase)
    } catch (error) {
      console.error(error)
    }
  }

  async receiveResponse(response) {
    const request = response.request()
    if (request.url.startsWith(urlClosingPrices)) {
      await this.receiveClosingPrices(await response.json())
    } else if (request.url.startsWith(urlDisplayDatas)) {
      await this.receiveDisplayDatas(await response.json())
    } else if (request.url.startsWith(urlInstruments)) {
      await this.receiveInstruments(await response.json())
    } else if (request.url.startsWith(urlGroups)) {
      await this.receiveGroups(await response.json())
    } else if (request.url.startsWith(urlActivity)) {
      await this.receiveActivity(await response.json())
    } else if (request.url.startsWith(urlPrivate)) {
      await this.receivePrivateInstruments(await response.json())
    } else if (request.url.startsWith(urlInsights)) {
      await this.receiveInsights(await response.json())
    }
  }

  async receiveClosingPrices(closingPrices) {
    await this.db.collection('closingPrices')
      .insertMany(closingPrices.map(
        closingPrice => ({
          date: new Date(),
          ...closingPrice,
        })))
  }

  async receiveDisplayDatas(displayDatas) {
    await this.db.collection('displayDatas')
      .insertMany(displayDatas.InstrumentDisplayDatas.map(
        instrument => ({
          date: new Date(),
          ...instrument,
        })
      ))
  }

  async receiveInstruments(instruments) {
    await this.db.collection('instruments')
      .insertMany(instruments.Instruments.map(
        instrument => ({
          date: new Date(),
          ...instrument,
        })
      ))
  }

  async receiveGroups(groups) {
    await this.receiveInstrumentTypes(groups.InstrumentTypes)
    await this.receiveExchangeInfo(groups.ExchangeInfo)
    await this.receiveStocksIndustries(groups.StocksIndustries)
  }

  async receiveInstrumentTypes(instrumentTypes) {
    await this.db.collection('instrumentTypes')
      .insertMany(instrumentTypes.map(
        instrumentType => ({
          date: new Date(),
          ...instrumentType,
        })
      ))
  }

  async receiveExchangeInfo(exchangeInfo) {
    await this.db.collection('exchangeInfo')
      .insertMany(exchangeInfo.map(
        exchange => ({
          date: new Date(),
          ...exchange,
        })
      ))
  }

  async receiveStocksIndustries(stocksIndustries) {
    await this.db.collection('stocksIndustries')
      .insertMany(stocksIndustries.map(
        industry => ({
          date: new Date(),
          ...industry,
        })
      ))
  }

  async receiveActivity(activity) {
    await this.receiveActivityStates(activity.InstrumentsToActivityState)
    await this.receiveRates(activity.Rates)
  }

  async receiveActivityStates(activityStates) {
    await this.db.collection('activityStates')
      .insertMany(Object.keys(activityStates).map(
        InstrumentId => ({
          date: new Date(),
          InstrumentId,
          ActivityState: activityStates[InstrumentId],
        })
      ))
  }

  async receiveRates(rates) {
    await this.db.collection('rates').insertMany(rates)
  }

  async receivePrivateInstruments(privateInstruments) {
    await this.db.collection('privateInstruments')
      .insertMany(privateInstruments.PrivateInstruments.map(
        privateInstrument => ({
          date: new Date(),
          ...privateInstrument,
        })
      ))
  }

  async receiveInsights(insights) {
    await this.db.collection('insights')
      .insertMany(insights.map(
        insight => ({
          date: new Date(),
          ...insight,
        })
      ))
  }
}

new DryMoose().run()