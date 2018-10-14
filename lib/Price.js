const moment = require('moment')

const Bot = require('./Bot')

const chartSelector = '.chart-wrapper'
const periodicityMenuSelector = '.period.menu'
const periodicitySelectorStart = '#period_'
const periodicitySelectorEnd = '_main'
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
      periodicity: 10,
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
    console.log(`Reading prices with periodicity ${this.config.periodicity}...`)
    this.isCancelled = false
    this.page = this.proCharts.page
    const instruments = this.filter.instruments.slice(0, 6)
    await this.setPeriodicity(instruments)
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

  async setPeriodicity(instruments) {
    for (let i = 0; i < instruments.length && !this.isCancelled; i++) {
      const isPeriodicitySelected = await this.isPeriodicitySelected(i)
      if (!isPeriodicitySelected) {
        await this.selectPeriodicity(i)
      }
    }
  }

  async isPeriodicitySelected(chartIndex) {
    const periodicity = await this.getPeriodicity(chartIndex)
    // Periodicity is always a string but this.config.periodicity can be a number
    return periodicity === `${this.config.periodicity}`
  }

  async getPeriodicity(chartIndex) {
    return await this.page.$eval(
      `${chartSelector}:nth-child(${chartIndex + 1}) ${containerSelector}`,
      container => {
        const vm = angular.element(container).scope().vm
        const selectedValue = vm.getPeriodicity()
        const { id: selectedPeriodicity } = vm.periodicityArray.find(
          periodicity => periodicity.value === selectedValue,
        )
        return selectedPeriodicity
      },
    )
  }

  async selectPeriodicity(chartIndex) {
    await this.click(
      `${chartSelector}:nth-child(${chartIndex + 1}) ` +
        periodicityMenuSelector,
    )
    await this.click(
      periodicitySelectorStart +
        this.config.periodicity +
        periodicitySelectorEnd,
    )
    await this.click(closeSelector)
  }

  async readPrices(instruments) {
    const prices = {}
    for (let i = 0; i < instruments.length; i++) {
      const instrument = instruments[i]
      const data = await this.readChartData(i, instrument)
      const lastPrice = JSON.stringify(data[data.length - 1])
      console.log(`${instrument.name} (${data.length}): ${lastPrice}`)
      prices[instrument.name] = data.map(price => ({
        date: moment.utc(price.Date, 'YYYYMMDDHHmm'),
        open: price.Open,
        close: price.Close,
        high: price.High,
        low: price.Low,
        volume: price.Volume,
        adjClose: price.Adj_Close,
      }))
    }
    return prices
  }

  async readChartData(chartIndex, instrument) {
    return await this.page.$eval(
      `${chartSelector}:nth-child(${chartIndex + 1}) ${containerSelector}`,
      (container, symbol, periodicity) => {
        const vm = angular.element(container).scope().vm
        if (vm.instrument.Name !== symbol) {
          throw new Error(
            `Wrong instrument found ${vm.instrument.Name}, ` +
              `expected ${symbol}!`,
          )
        }
        const selectedValue = vm.getPeriodicity()
        const { id: selectedPeriodicity } = vm.periodicityArray.find(
          periodicity => periodicity.value === selectedValue,
        )
        if (selectedPeriodicity !== periodicity) {
          throw new Error(
            `Wrong periodicity found ${selectedPeriodicity} ` +
              `for instrument ${symbol}, expected ${periodicity}!`,
          )
        }
        return vm.stxx.masterData
      },
      instrument.name,
      `${this.config.periodicity}`, // this.config.periodicity can be a number
    )
  }
}

module.exports = Price
