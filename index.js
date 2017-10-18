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

  } catch (error) {
    console.error(error)
    chrome.close()
  }
}

main()