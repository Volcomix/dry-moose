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
  Read: 'Read',
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
      [Events.Read]: () => this.read(),
      [Events.Cancel]: () => this.cancel(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/price', routes, events, config)
    this.proCharts = proCharts
    this.filter = filter
  }

  async read() {
    if (!this.proCharts.page) {
      console.warn('ProCharts is stopped, prices could not be read!')
      return
    }
    if (!this.filter.instruments || !this.filter.instruments.length) {
      console.warn('No instrument to load prices!')
      return
    }
    this.emit(Events.Status, Status.Reading)
    console.log('Reading prices...')
    this.isCancelled = false
    this.page = this.proCharts.page
    this.instruments = this.filter.instruments.slice(0, 6)
    await this.setPeriod()
    if (this.isCancelled) {
      this.emit(Events.Status, Status.Cancelled)
      console.log('Prices reading cancelled.')
    } else {
      this.prices = await this.readPrices()
      this.emit(Events.Status, Status.Read, this.prices)
      console.log('Prices read.')
    }
  }

  async cancel() {
    this.isCancelled = true
    this.emit(Events.Status, Status.Cancelling)
    console.log('Cancelling prices reading...')
  }

  async setPeriod() {
    for (let i = 1; i <= this.instruments.length && !this.isCancelled; i++) {
      await this.click(`${chartSelector}:nth-child(${i}) ${periodMenuSelector}`)
      await this.click(
        `${periodSelectorStart}${this.config.period}${periodSelectorEnd}`,
      )
      await this.click(closeSelector)
    }
  }

  async readPrices() {
    const prices = {}
    for (let i = 0; i < this.instruments.length; i++) {
      const data = await this.page.$eval(
        `${chartSelector}:nth-child(${i + 1}) ${containerSelector}`,
        container => angular.element(container).scope().vm.stxx.masterData,
      )
      const lastPrice = JSON.stringify(data[data.length - 1])
      const instrument = this.instruments[i]
      console.log(`${instrument.name} (${data.length}): ${lastPrice}`)
      prices[instrument.name] = data
    }
    return prices
  }
}

module.exports = Price
