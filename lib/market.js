const Bot = require('./bot')

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const cryptocurrenciesSelector =
  '.menu-list-item [href="/discover/markets/cryptocurrencies"]'

class Market extends Bot {
  async scan() {
    await this.click(marketsSelector)
    await this.click(cryptocurrenciesSelector)
    await this.click('.etoro-buy-button .etoro-trade-button')
    await this.page.waitForSelector('.clock-icon')
    const isOpen = !!(await this.page.$('.clock-icon.clock-open'))
    console.log('isOpen:', isOpen)
    await this.type('.stepper-value', '0')
    await this.click('.other-info')
    await this.waitForMouse()
    const value = await this.page.$eval('.stepper-value', value =>
      parseFloat(value.value.substr(1)),
    )
    console.log('minPositionAmount:', value)
    await this.click('.head-button.close')
  }
}

module.exports = Market
