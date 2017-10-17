const Chrome = require('./chrome')
const Market = require('./market')

async function main() {
  const chrome = new Chrome()
  try {
    await chrome.launch()
    const market = await Market.watch(chrome.client)
    console.log(`${
      Object.keys(market.instruments)
        .map(instrument => market.instruments[instrument])
        .filter(instrument => instrument.IsMarketOpen && !instrument.IsDelisted)
        .length
      } instruments in open market.`
    )
  } catch (error) {
    console.error(error)
    chrome.close()
  }
}

main()