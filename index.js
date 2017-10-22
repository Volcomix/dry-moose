const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const MongoClient = require('mongodb').MongoClient

const Chrome = require('./chrome')
const Market = require('./market')

const maxBet = 500

async function main() {
  const chrome = new Chrome()
  try {
    await chrome.launch()

    console.log('Connecting to MongoDB...')
    const url = 'mongodb://localhost:27017/dry-moose'
    const db = await MongoClient.connect(url)
    console.log('MongoDB connected.')

    chrome.on('close', code => {
      if (db) {
        console.log('Closing MongoDB connection...')
        db.close()
        console.log('MongoDB connection closed.')
      }
    })

    const market = await Market.watch(chrome.client)

    Object.values(market.instruments).forEach(instr => {
      instr._bidAskSpread = instr.Ask - instr.Bid
      instr._bidAskSpreadPercent = instr._bidAskSpread / instr.Ask
      instr._minCost = instr.MinPositionAmount * instr._bidAskSpreadPercent
    })

    const collectionNames = [
      'instruments',
      'instrumentTypes',
      'exchangeInfo',
      'stocksIndustries',
    ]

    for (let name of collectionNames) {
      const collection = db.collection(name)
      try {
        await collection.drop()
      } catch (error) {
        // Collection does not exist
      }
      await collection.insertMany(Object.values(market[name]))
    }

    const instruments = Object.values(market.instruments)
      .filter(instrument =>
        instrument._isActive
        && instrument.IsMarketOpen
        && !instrument.IsDelisted
        && instrument.MinPositionAmountAbsolute <= maxBet
      )
      .sort((a, b) => a._minCost - b._minCost)
      .slice(0, 6)

    instruments.forEach(instrument => {
      console.log(`${instrument.SymbolFull}: ${instrument._minCost}`)
    })

    return

    const speed = 500

    await clickElement(chrome.client, '.options.dropdown-menu')
    await setTimeoutPromise(speed)
    await clickElement(chrome.client, '.drop-select-box-option.edit')
    let deleted = true
    while (deleted) {
      await setTimeoutPromise(speed)
      deleted = await clickElement(chrome.client,
        '.table-body.market .table-row.edit .card-head-remove'
      )
    }
    await setTimeoutPromise(speed)
    await clickElement(chrome.client,
      '.inner-header-buttons.edit.edit-head .done[ng-show="editMode"]'
    )

    return

    console.log(`${instruments.length} instruments with min bet <= ${maxBet}$`)

    const infos = new Set(
      instruments.map(instrument => {
        const instruId = instrument.InstrumentTypeID
        const instrumentType = market.instrumentTypes[instruId]
        let desc = instrumentType.InstrumentTypeDescription
        const indusId = instrument.StocksIndustryID
        if (indusId) {
          const industry = market.stocksIndustries[indusId]
          desc += ` - Industry: ${industry.IndustryName}`
        }
        const exchId = instrument.ExchangeID
        if (exchId) {
          const exchange = market.exchangeInfo[exchId]
          if (exchange) {
            desc += ` - Exchange: ${exchange.ExchangeDescription}`
          }
        }
        return desc
      })
    )
    console.log(infos)

  } catch (error) {
    console.error(error)
    chrome.close()
  }
}

async function clickElement({ Runtime, Input }, selectors) {
  const { result: { value: target } } = await Runtime.evaluate({
    expression: `(${selectors => {
      const node = document
        .querySelector(selectors)
      if (!node) {
        return
      }
      const rect = node.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }})('${selectors}')`,
    returnByValue: true,
  })

  if (target) {
    const options = { button: 'left', clickCount: 1, ...target }
    options.type = 'mousePressed'
    await Input.dispatchMouseEvent(options)
    options.type = 'mouseReleased'
    await Input.dispatchMouseEvent(options)
    return true
  }
  return false
}

main()