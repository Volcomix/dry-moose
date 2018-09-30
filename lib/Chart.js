const Bot = require('./Bot')

const layoutMenuSelector = 'pro-charts-dropdown'
const layout6Selector = '.sprite-prochart.prochart-item-image.template-15'
const emptySelector = '.cq-chart-container-empty:not(.ng-hide)'
const searchSelector = '.w-search-input'
const searchResultSelector = '.i-search-result.active'
// const chartSelector = '.chart-wrapper'
// const periodMenuSelector = '.period.menu'
// const periodSelectorStart = '#period_'
// const periodSelectorEnd = '_main'
// const closeSelector = '#dialogClose'
// const containerSelector = '#chartContainer'

const Events = {
  Load: 'Load',
  Cancel: 'Cancel',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Loading: 'Loading',
  Loaded: 'Loaded',
  Cancelling: 'Cancelling',
  Cancelled: 'Cancelled',
}

class Chart extends Bot {
  constructor(proCharts, filter, io) {
    // const config = {
    //   /** 1, 5, 10, 15, 30, 60, 240, 'day', 'week' */
    //   period: 10,
    // }
    const routes = {
      [Events.Load]: () => this.load(),
      [Events.Cancel]: () => this.cancel(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/chart', routes, events)
    this.proCharts = proCharts
    this.filter = filter
  }

  async load() {
    if (!this.proCharts.page) {
      console.warn(
        'ProCharts is stopped, instruments charts could not be loaded!',
      )
      return
    }
    if (!this.filter.instruments || !this.filter.instruments.length) {
      console.warn('No instrument to load!')
      return
    }
    this.emit(Events.Status, Status.Loading)
    console.log('Loading instruments charts...')
    this.isCancelled = false
    this.page = this.proCharts.page
    await this.click(layoutMenuSelector)
    await this.click(layout6Selector)
    await this.click(layoutMenuSelector)
    for (let instrument of this.filter.instruments) {
      if (this.isCancelled) {
        this.emit(Events.Status, Status.Cancelled)
        console.log('Instruments charts loading cancelled.')
        return
      }
      await this.click(emptySelector)
      await this.type(searchSelector, instrument)
      await this.page.waitForSelector(searchResultSelector)
      await this.page.keyboard.press('Enter')
    }
    this.emit(Events.Status, Status.Loaded)
    console.log('Instruments charts loaded.')
  }

  cancel() {
    this.isCancelled = true
    this.emit(Events.Status, Status.Cancelling)
    console.log('Cancelling instruments charts loading...')
  }

  // async setPeriod() {
  //   for (let i = 1; i <= this.instruments.length; i++) {
  //     await this.click(`${chartSelector}:nth-child(${i}) ${periodMenuSelector}`)
  //     await this.click(
  //       `${periodSelectorStart}${this.config.period}${periodSelectorEnd}`,
  //     )
  //     await this.click(closeSelector)
  //   }
  // }

  // async read() {
  //   const data = {}
  //   for (let i = 0; i < this.instruments.length; i++) {
  //     const instrument = this.instruments[i]
  //     const prices = await this.page.$eval(
  //       `${chartSelector}:nth-child(${i + 1}) ${containerSelector}`,
  //       container => angular.element(container).scope().vm.stxx.masterData,
  //     )
  //     const lastPrice = JSON.stringify(prices[prices.length - 1])
  //     console.log(`${instrument} (${prices.length}): ${lastPrice}`)
  //     data[instrument] = prices
  //   }
  //   return data
  // }
}

module.exports = Chart
