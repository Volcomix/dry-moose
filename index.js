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

let db

async function main() {
  try {
    const browser = await puppeteer.launch({ appMode: true, ...chromeOptions })

    db = await MongoClient.connect(mongoUri)
    await db.collection('executions').insertOne({
      date: new Date(),
      event: 'start',
    })

    const page = await browser.newPage()
    page.on('response', async response => {
      const request = response.request()
      if (request.url.startsWith(urlClosingPrices)) {
        await receiveClosingPrices(await response.json())
      } else if (request.url.startsWith(urlDisplayDatas)) {
        await receiveDisplayDatas(await response.json())
      } else if (request.url.startsWith(urlInstruments)) {
        await receiveInstruments(await response.json())
      } else if (request.url.startsWith(urlGroups)) {
        await receiveGroups(await response.json())
      } else if (request.url.startsWith(urlActivity)) {
        await receiveActivity(await response.json())
      } else if (request.url.startsWith(urlPrivate)) {
        await receivePrivateInstruments(await response.json())
      } else if (request.url.startsWith(urlInsights)) {
        await receiveInsights(await response.json())
      }
    })
    await page.goto(urlBase)
  } catch (error) {
    console.error(error)
  }
}

async function receiveClosingPrices(closingPrices) {
  await db.collection('closingPrices')
    .insertMany(closingPrices.map(
      closingPrice => ({
        date: new Date(),
        ...closingPrice,
      })))
}

async function receiveDisplayDatas(displayDatas) {
  await db.collection('displayDatas')
    .insertMany(displayDatas.InstrumentDisplayDatas.map(
      instrument => ({
        date: new Date(),
        ...instrument,
      })
    ))
}

async function receiveInstruments(instruments) {
  await db.collection('instruments')
    .insertMany(instruments.Instruments.map(
      instrument => ({
        date: new Date(),
        ...instrument,
      })
    ))
}

async function receiveGroups(groups) {
  await receiveInstrumentTypes(groups.InstrumentTypes)
  await receiveExchangeInfo(groups.ExchangeInfo)
  await receiveStocksIndustries(groups.StocksIndustries)
}

async function receiveInstrumentTypes(instrumentTypes) {
  await db.collection('instrumentTypes')
    .insertMany(instrumentTypes.map(
      instrumentType => ({
        date: new Date(),
        ...instrumentType,
      })
    ))
}

async function receiveExchangeInfo(exchangeInfo) {
  await db.collection('exchangeInfo')
    .insertMany(exchangeInfo.map(
      exchange => ({
        date: new Date(),
        ...exchange,
      })
    ))
}

async function receiveStocksIndustries(stocksIndustries) {
  await db.collection('stocksIndustries')
    .insertMany(stocksIndustries.map(
      industry => ({
        date: new Date(),
        ...industry,
      })
    ))
}

async function receiveActivity(activity) {
  await receiveActivityStates(activity.InstrumentsToActivityState)
  await receiveRates(activity.Rates)
}

async function receiveActivityStates(activityStates) {
  await db.collection('activityStates')
    .insertMany(Object.keys(activityStates).map(
      InstrumentId => ({
        date: new Date(),
        InstrumentId,
        ActivityState: activityStates[InstrumentId],
      })
    ))
}

async function receiveRates(rates) {
  await db.collection('rates').insertMany(rates)
}

async function receivePrivateInstruments(privateInstruments) {
  await db.collection('privateInstruments')
    .insertMany(privateInstruments.PrivateInstruments.map(
      privateInstrument => ({
        date: new Date(),
        ...privateInstrument,
      })
    ))
}

async function receiveInsights(insights) {
  await db.collection('insights')
    .insertMany(insights.map(
      insight => ({
        date: new Date(),
        ...insight,
      })
    ))
}

main()