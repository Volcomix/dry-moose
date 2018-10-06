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
    const instruments = this.filter.instruments.slice(0, 6)
    await this.setPeriod(instruments)
    if (this.isCancelled) {
      this.emit(Events.Status, Status.Cancelled)
      console.log('Prices reading cancelled.')
    } else {
      this.prices = await this.readPrices(instruments)
      this.emit(Events.Status, Status.Read, this.prices)
      console.log('Prices read.')
    }
  }

  async cancel() {
    this.isCancelled = true
    this.emit(Events.Status, Status.Cancelling)
    console.log('Cancelling prices reading...')
  }

  async setPeriod(instruments) {
    for (let i = 0; i < instruments.length && !this.isCancelled; i++) {
      const isPeriodSelected = await this.isPeriodSelected(i)
      if (!isPeriodSelected) {
        await this.selectPeriod(i)
      }
    }
  }

  async isPeriodSelected(chartIndex) {
    const period = await this.getPeriod(chartIndex)
    // Period is always a string but this.config.period can be a number
    return period === `${this.config.period}`
  }

  async getPeriod(chartIndex) {
    return await this.page.$eval(
      `${chartSelector}:nth-child(${chartIndex + 1}) ${containerSelector}`,
      container => {
        const vm = angular.element(container).scope().vm
        const selectedValue = vm.getPeriodicity()
        const selectedPeriodicity = vm.periodicityArray.find(
          periodicity => periodicity.value === selectedValue,
        )
        return selectedPeriodicity.id
      },
    )
  }

  async selectPeriod(chartIndex) {
    await this.click(
      `${chartSelector}:nth-child(${chartIndex + 1}) ${periodMenuSelector}`,
    )
    await this.click(
      `${periodSelectorStart}${this.config.period}${periodSelectorEnd}`,
    )
    await this.click(closeSelector)
  }

  async readPrices(instruments) {
    const prices = {}
    for (let i = 0; i < instruments.length; i++) {
      const data = await this.page.$eval(
        `${chartSelector}:nth-child(${i + 1}) ${containerSelector}`,
        container => angular.element(container).scope().vm.stxx.masterData,
      )
      const instrument = instruments[i]
      const lastPrice = JSON.stringify(data[data.length - 1])
      console.log(`${instrument.name} (${data.length}): ${lastPrice}`)
      prices[instrument.name] = data
    }
    return prices
  }
}

module.exports = Price
