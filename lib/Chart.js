const Bot = require('./Bot')

const chartSelector = '.chart-wrapper'
const symbolSelector = '.symbolDescription'
const searchSelector = '.w-search-input'
const searchResultSelector = '.i-search-result.active'

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
    const instruments = this.filter.instruments.slice(0, 6)
    await this.loadInstruments(instruments)
    if (this.isCancelled) {
      this.emit(Events.Status, Status.Cancelled)
      console.log('Instruments charts loading cancelled.')
    } else {
      await this.checkInstruments(instruments)
      this.emit(Events.Status, Status.Loaded)
      console.log('Instruments charts loaded.')
    }
  }

  cancel() {
    this.isCancelled = true
    this.emit(Events.Status, Status.Cancelling)
    console.log('Cancelling instruments charts loading...')
  }

  async loadInstruments(instruments) {
    for (let i = 0; i < instruments.length && !this.isCancelled; i++) {
      const instrument = instruments[i]
      const isInstrumentLoaded = await this.isInstrumentLoaded(instrument, i)
      if (!isInstrumentLoaded) {
        await this.loadInstrument(instrument, i)
      }
    }
  }

  async isInstrumentLoaded(instrument, chartIndex) {
    const symbol = await this.page.$eval(
      `${chartSelector}:nth-child(${chartIndex + 1}) ${symbolSelector}`,
      symbol => symbol.textContent,
    )
    return symbol === instrument.name
  }

  async loadInstrument(instrument, chartIndex) {
    await this.click(`${chartSelector}:nth-child(${chartIndex + 1})`)
    await this.type(searchSelector, instrument.name)
    await this.page.waitForSelector(searchResultSelector)
    await this.page.keyboard.press('Enter')
    await this.waitForSelectorNot(searchResultSelector)
  }

  async checkInstruments(instruments) {
    const loadedSymbols = await this.page.$$eval(
      `${chartSelector} ${symbolSelector}`,
      symbols => symbols.map(symbol => symbol.textContent),
    )
    instruments.forEach((instrument, i) => {
      if (loadedSymbols[i] !== instrument.name) {
        throw new Error(`Failed loading instrument ${instrument.name}!`)
      }
    })
  }
}

module.exports = Chart
