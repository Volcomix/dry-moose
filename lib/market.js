const Bot = require('./bot')

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const filterSelector = '[automation-id="discover-market-filter-button"]'
const itemSelector = '[automation-id="discover-popup-filter-item"]'
const exchangeSelector = `${itemSelector}:nth-child(1)`
const backSelector = '[automation-id="discover-popup-filter-back-button"]'
const nextSelector =
  '[automation-id="discover-market-next-button"]:not(.disabled)'

class Market extends Bot {
  async discover() {
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

    console.log(
      '1st minPositionAmount:',
      await this.page.evaluate(
        () =>
          angular
            .element('body')
            .scope()
            .session.instrumentsFactory.getAll()[1].MinPositionAmount,
      ),
    )
  }

  async discoverExchanges() {
    await this.click(exchangeSelector)
    const exchanges = await this.page.$$(itemSelector)
    await this.click(`${itemSelector}:nth-child(1)`)
    await this.scanAllPages()
    for (let i = 2; i <= exchanges.length; i++) {
      await this.click(filterSelector)
      await this.click(exchangeSelector)
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
}

module.exports = Market
