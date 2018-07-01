const Bot = require('./bot')

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const cryptocurrenciesSelector =
  '.menu-list-item [href="/discover/markets/cryptocurrencies"]'

class Market extends Bot {
  async scan() {
    await this.clickToNavigate(marketsSelector)
    await this.clickToNavigate(cryptocurrenciesSelector)
  }
}

module.exports = Market
