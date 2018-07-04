const Bot = require('./bot')

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const filterSelector = '[automation-id="discover-market-filter-button"]'
const cryptoSelector =
  '[automation-id="discover-popup-filter-item"]:nth-child(5)'
const etfsSelector = '[automation-id="discover-popup-filter-item"]:nth-child(6)'
const stocksSelector =
  '[automation-id="discover-popup-filter-item"]:nth-child(1)'
const exchangeSelector =
  '[automation-id="discover-popup-filter-item"]:nth-child(1)'
const nasdaqSelector =
  '[automation-id="discover-popup-filter-item"]:nth-child(1)'
const nyseSelector = '[automation-id="discover-popup-filter-item"]:nth-child(2)'
const frankfurtSelector =
  '[automation-id="discover-popup-filter-item"]:nth-child(3)'
const nextSelector =
  '[automation-id="discover-market-next-button"]:not(.disabled)'

class Market extends Bot {
  async scan() {
    await this.click(marketsSelector)
    await this.click(filterSelector)
    await this.click(cryptoSelector)
    await this.scanAllPages()
    await this.click(filterSelector)
    await this.click(etfsSelector)
    await this.scanAllPages()
    await this.click(filterSelector)
    await this.click(stocksSelector)
    await this.click(exchangeSelector)
    await this.click(nasdaqSelector)
    await this.scanAllPages()
    await this.click(filterSelector)
    await this.click(exchangeSelector)
    await this.click(nyseSelector)
    await this.scanAllPages()
    await this.click(filterSelector)
    await this.click(exchangeSelector)
    await this.click(frankfurtSelector)
    await this.scanAllPages()

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

  async scanAllPages() {
    await this.waitForMouse()
    while (await this.page.$(nextSelector)) {
      await this.click(nextSelector)
    }
  }
}

module.exports = Market
