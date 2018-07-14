const Bot = require('./bot')

const cogWheelSelector = '[automation-id="watchlist-watchlist-btn-cogwheel"]'
const proChartsSelector =
  '[automation-id="watchlist-watchlist-btn-cogwheel-procharts"]'
const layoutMenuSelector = 'pro-charts-dropdown'
const layout6Selector = '.sprite-prochart.prochart-item-image.template-15'
const emptySelector = '.cq-chart-container-empty:not(.ng-hide)'
const searchSelector = '.w-search-input'
const searchEnterDelay = 500

class Chart extends Bot {
  async open() {
    console.log('Opening ProCharts...')
    await this.click(cogWheelSelector)
    await this.click(proChartsSelector)
    let pages = await this.page.browser().pages()
    while (pages.length === 1) {
      await this.sleep(500)
      pages = await this.page.browser().pages()
    }
    this.page = pages[1]
    await this.page.waitForNavigation()
    console.log('ProCharts opened.')
  }

  async load(instruments) {
    console.log('Loading instruments charts...')
    await this.click(layoutMenuSelector)
    await this.click(layout6Selector)
    await this.click(layoutMenuSelector)
    for (let instrument of instruments) {
      await this.click(emptySelector)
      await this.type(searchSelector, instrument)
      await this.sleep(searchEnterDelay)
      await this.page.keyboard.press('Enter')
    }
    console.log('Instruments charts loaded.')
  }
}

module.exports = Chart
