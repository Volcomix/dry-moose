const Bot = require('./bot')

/** 1, 5, 10, 15, 30, 60, 240, 'day', 'week' */
const period = 10

const watchlistsSelector = '.i-menu-link[href="/watchlists"]'
const cogWheelSelector = '[automation-id="watchlist-watchlist-btn-cogwheel"]'
const proChartsSelector =
  '[automation-id="watchlist-watchlist-btn-cogwheel-procharts"]'
const layoutMenuSelector = 'pro-charts-dropdown'
const layout6Selector = '.sprite-prochart.prochart-item-image.template-15'
const emptySelector = '.cq-chart-container-empty:not(.ng-hide)'
const searchSelector = '.w-search-input'
const searchEnterDelay = 500
const chartSelector = '.chart-wrapper'
const periodMenuSelector = '.period.menu'
const periodSelector = `#period_${period}_main`
const closeSelector = '#dialogClose'
const containerSelector = '#chartContainer'

class Chart extends Bot {
  async open() {
    console.log('Opening ProCharts...')
    await this.click(watchlistsSelector)
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
    this.instruments = instruments
    await this.click(layoutMenuSelector)
    await this.click(layout6Selector)
    await this.click(layoutMenuSelector)
    for (let instrument of this.instruments) {
      await this.click(emptySelector)
      await this.type(searchSelector, instrument)
      await this.sleep(searchEnterDelay)
      await this.page.keyboard.press('Enter')
    }
    await this.setPeriod()
    console.log('Instruments charts loaded.')
  }

  async setPeriod() {
    for (let i = 1; i <= this.instruments.length; i++) {
      await this.click(`${chartSelector}:nth-child(${i}) ${periodMenuSelector}`)
      await this.click(periodSelector)
      await this.click(closeSelector)
    }
  }

  async read() {
    const data = {}
    for (let i = 0; i < this.instruments.length; i++) {
      const instrument = this.instruments[i]
      data[instrument] = await this.page.$eval(
        `${chartSelector}:nth-child(${i + 1}) ${containerSelector}`,
        container => angular.element(container).scope().vm.stxx.masterData,
      )
      console.log(
        `${instrument} (${data[instrument].length}): ${JSON.stringify(
          data[instrument][data[instrument].length - 1],
        )}`,
      )
    }
    return data
  }
}

module.exports = Chart
