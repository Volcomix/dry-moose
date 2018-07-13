const Bot = require('./bot')

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const filterSelector = '[automation-id="discover-market-filter-button"]'
const itemSelector = '[automation-id="discover-popup-filter-item"]'
const industrySelector = `${itemSelector}:nth-child(2)`
const backSelector = '[automation-id="discover-popup-filter-back-button"]'
const nextSelector =
  '[automation-id="discover-market-next-button"]:not(.disabled)'

class Market extends Bot {
  async discover() {
    console.log('Discovering markdet...')
    await this.click(marketsSelector)
    await this.click(filterSelector)
    const markets = await this.page.$$(itemSelector)
    await this.click(`${itemSelector}:nth-child(1)`)
    await this.discoverExchanges()
    await this.click(filterSelector)
    await this.click(backSelector)
    await this.click(`${itemSelector}:nth-child(2)`)
    await this.scanAllPages()
    for (let i = 3; i <= markets.length; i++) {
      await this.click(filterSelector)
      await this.click(`${itemSelector}:nth-child(${i})`)
      await this.scanAllPages()
    }
    await this.wait()
    console.log('Market discovered.')
  }

  async discoverExchanges() {
    await this.click(industrySelector)
    const exchanges = await this.page.$$(itemSelector)
    await this.click(`${itemSelector}:nth-child(1)`)
    await this.scanAllPages()
    for (let i = 2; i <= exchanges.length; i++) {
      await this.click(filterSelector)
      await this.click(industrySelector)
      await this.click(`${itemSelector}:nth-child(${i})`)
      await this.scanAllPages()
    }
  }

  async scanAllPages() {
    await this.waitForMouse()
    while (await this.page.$(nextSelector)) {
      await this.click(nextSelector)
    }
  }

  async wait() {
    const sessionHandle = await this.page.evaluateHandle(
      () => angular.element('body').scope().session,
    )

    const instrumentsCount = await this.page.evaluate(
      session => Object.keys(session.instrumentsFactory.getAll()).length,
      sessionHandle,
    )

    let scannedCount = 0
    while (scannedCount < instrumentsCount) {
      await this.sleep(500)
      scannedCount = await this.page.evaluate(
        session =>
          Object.keys(session.instrumentsFactory.getAll()).filter(id =>
            session.instrumentsFactory.getTradingSettingByInstrumentId(
              id,
              'InstrumentID',
            ),
          ).length,
        sessionHandle,
      )
    }
  }
}

module.exports = Market
