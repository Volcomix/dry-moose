const Chrome = require('./chrome')
const Market = require('./market')

async function main() {
  const chrome = new Chrome()
  try {
    await chrome.launch()
    const market = await Market.watch(chrome.client)

    const maxBet = 50

    const instruments = Object.keys(market.instruments)
      .map(instrument => market.instruments[instrument])
      .filter(instrument => instrument._isActive && !instrument.IsDelisted)
      .map(instrument => {
        const leverage = instrument.Leverages[instrument.Leverages.length - 1]
        instrument._minBet = Math.max(
          instrument.MinPositionAmount / leverage,
          instrument.MinPositionAmountAbsolute
        )

        const minLeverage = instrument.Leverages.find(leverage =>
          instrument.MinPositionAmount / leverage === instrument._minBet
        )
        const askAmount = instrument._minBet * minLeverage
        const minUnits = askAmount / instrument.Ask
        const bidAmount = minUnits * instrument.Bid
        instrument._minCost = askAmount - bidAmount

        return instrument
      })
      .filter(instrument => instrument._minBet <= maxBet)
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

    instruments
      .sort((a, b) => a._minCost - b._minCost)
      .slice(0, 20)
      .forEach(instrument => {
        console.log(`${instrument.SymbolFull}: ${instrument._minCost}`)
      })

  } catch (error) {
    console.error(error)
    chrome.close()
  }
}

main()