const Bot = require('./Bot')

const chartSelector = '.chart-wrapper'
const periodMenuSelector = '.period.menu'
const periodSelectorStart = '#period_'
const periodSelectorEnd = '_main'
const closeSelector = '#dialogClose'
const containerSelector = '#chartContainer'

const Events = {
  Read: 'Read',
  Cancel: 'Cancel',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Reading: 'Reading',
  Readed: 'Readed',
  Cancelling: 'Cancelling',
  Cancelled: 'Cancelled',
}

class Price extends Bot {
  constructor(proCharts, filter, io) {
    const config = {
      /** 1, 5, 10, 15, 30, 60, 240, 'day', 'week' */
      period: 10,
    }
    const routes = {
      // [Events.Load]: () => this.load(),
      // [Events.Cancel]: () => this.cancel(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/price', routes, events, config)
    this.proCharts = proCharts
    this.filter = filter
  }

  async setPeriod() {
    for (let i = 1; i <= this.instruments.length; i++) {
      await this.click(`${chartSelector}:nth-child(${i}) ${periodMenuSelector}`)
      await this.click(
        `${periodSelectorStart}${this.config.period}${periodSelectorEnd}`,
      )
      await this.click(closeSelector)
    }
  }

  async read() {
    const data = {}
    for (let i = 0; i < this.instruments.length; i++) {
      const instrument = this.instruments[i]
      const prices = await this.page.$eval(
        `${chartSelector}:nth-child(${i + 1}) ${containerSelector}`,
        container => angular.element(container).scope().vm.stxx.masterData,
      )
      const lastPrice = JSON.stringify(prices[prices.length - 1])
      console.log(`${instrument} (${prices.length}): ${lastPrice}`)
      data[instrument] = prices
    }
    return data
  }
}

module.exports = Price
