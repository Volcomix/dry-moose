const Chrome = require('./chrome')
const Market = require('./market')

async function main() {
  try {
    const client = await Chrome.launch()
    const market = await Market.fetch(client)
    return

    const { Network, Page, Runtime } = client

    const requests = {}
    const instruments = {}
    const instrumentTypes = {}
    const exchangeInfo = {}
    const stocksIndustries = {}

    Network.requestWillBeSent(({ requestId, request }) => {
      if (request.url.startsWith('https://api.etorostatic.com/sapi/candles/closingprices.json')) {
        requests[requestId] = response => {
          response.forEach(instrument => {
            const existing = instruments[instrument.InstrumentId]
            if (existing) {
              Object.assign(existing, instrument)
            } else {
              instruments[instrument.InstrumentId] = instrument
            }
          })
        }
      } else if (request.url.startsWith('https://api.etorostatic.com/sapi/instrumentsmetadata/V1.1/instruments')) {
        requests[requestId] = response => {
          response.InstrumentDisplayDatas.forEach(displayData => {
            const existing = instruments[displayData.InstrumentID]
            if (existing) {
              Object.assign(existing, displayData)
            } else {
              instruments[displayData.InstrumentID] = displayData
            }
          })
        }
      } else if (request.url.startsWith('https://api.etorostatic.com/sapi/trade-real/instruments')) {
        requests[requestId] = response => {
          response.Instruments.forEach(instrument => {
            const existing = instruments[instrument.InstrumentID]
            if (existing) {
              Object.assign(existing, instrument)
            } else {
              instruments[instrument.InstrumentID] = instrument
            }
          })
        }
      } else if (request.url.startsWith('https://api.etorostatic.com/sapi/app-data/web-client/app-data/instruments-groups.json')) {
        requests[requestId] = response => {
          response.InstrumentTypes.forEach(instrumentType => {
            const existing = instrumentTypes[instrumentType.InstrumentTypeID]
            if (existing) {
              Object.assign(existing, instrumentType)
            } else {
              instrumentTypes[instrumentType.InstrumentTypeID] = instrumentType
            }
          })

          console.log(instrumentTypes)

          response.ExchangeInfo.forEach(info => {
            const existing = exchangeInfo[info.ExchangeID]
            if (existing) {
              Object.assign(existing, info)
            } else {
              exchangeInfo[info.ExchangeID] = info
            }
          })

          console.log(exchangeInfo)

          response.StocksIndustries.forEach(stocksIndustry => {
            const existing = stocksIndustries[stocksIndustry.IndustryID]
            if (existing) {
              Object.assign(existing, stocksIndustry)
            } else {
              stocksIndustries[stocksIndustry.IndustryID] = stocksIndustry
            }
          })

          console.log(stocksIndustries)
        }
      } else if (request.url.startsWith('https://www.etoro.com/sapi/trade-real/instruments/?InstrumentDataFilters')) {
        requests[requestId] = response => {
          response.Rates.forEach(rate => {
            const existing = instruments[rate.InstrumentID]
            if (existing) {
              Object.assign(existing, rate)
            } else {
              instruments[rate.InstrumentID] = rate
            }
          })
        }
      } else if (request.url.startsWith('https://www.etoro.com/sapi/trade-real/instruments/private')) {
        requests[requestId] = response => {
          response.PrivateInstruments.forEach(instrument => {
            const existing = instruments[instrument.InstrumentID]
            if (existing) {
              Object.assign(existing, instrument)
            } else {
              instruments[instrument.InstrumentID] = instrument
            }
          })
        }
      } else if (request.url.startsWith('https://www.etoro.com/sapi/insights/insights/uniques')) {
        requests[requestId] = response => {
          response.forEach(instrument => {
            const existing = instruments[instrument.instrumentId]
            if (existing) {
              Object.assign(existing, instrument)
            } else {
              instruments[instrument.instrumentId] = instrument
            }
          })

          console.log(
            Object.keys(instruments)
              .filter(instrumentId => {
                const instrument = instruments[instrumentId]
                return !instrument.IsDelisted && instrument.IsMarketOpen
              })
              .map(instrumentId => instruments[instrumentId])
          )
        }
      }
    })

    Network.loadingFinished(async ({ requestId }) => {
      const callback = requests[requestId]
      if (callback) {
        const response = await Network.getResponseBody({ requestId })
        let body = response.body
        if (response.base64Encoded) {
          crypto
          body = Buffer.from(body, 'base64').toString()
        }
        callback(JSON.parse(body))
      }
    })

    await Network.enable()
    await Page.enable()
    await Page.navigate({ url: 'https://www.etoro.com' })

    await Page.loadEventFired()
    const mode = await Runtime.evaluate({
      expression: `(${() => {
        return new Promise((resolve, reject) => {
          const observer = new MutationObserver((mutations, observer) => {
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                  return
                }
                const mode = node.querySelector('.i-menu-link-mode-demo')
                if (mode) {
                  observer.disconnect()
                  resolve(mode.innerText.trim())
                }
              })
            })
          })

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          })
        })
      }})()`,
      awaitPromise: true,
    })
    console.log(`Mode: ${mode.result.value}`)
  } catch (error) {
    console.error(error)
  }
}

main()