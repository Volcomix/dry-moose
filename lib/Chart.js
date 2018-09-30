const Bot = require('./Bot')

const layoutMenuSelector = 'pro-charts-dropdown'
const layout6Selector = '.sprite-prochart.prochart-item-image.template-15'
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
    await this.changeLayout()
    await this.loadInstruments()
    if (this.isCancelled) {
      this.emit(Events.Status, Status.Cancelled)
      console.log('Instruments charts loading cancelled.')
    } else {
      await this.checkInstruments()
      this.emit(Events.Status, Status.Loaded)
      console.log('Instruments charts loaded.')
    }
  }

  cancel() {
    this.isCancelled = true
    this.emit(Events.Status, Status.Cancelling)
    console.log('Cancelling instruments charts loading...')
  }

  async changeLayout() {
    const charts = await this.page.$$(chartSelector)
    if (charts.length < 6) {
      await this.click(layoutMenuSelector)
      await this.click(layout6Selector)
      await this.click(layoutMenuSelector)
    }
  }

  async loadInstruments() {
    const instruments = this.filter.instruments.slice(0, 6)
    for (let i = 0; i < instruments.length && !this.isCancelled; i++) {
      await this.click(`${chartSelector}:nth-child(${i + 1})`)
      await this.type(searchSelector, instruments[i].name)
      await this.page.waitForSelector(searchResultSelector)
      await this.page.keyboard.press('Enter')
      await this.waitForSelectorNot(searchResultSelector)
    }
  }

  async checkInstruments() {
    const loadedSymbols = await this.page.$$eval(
      `${chartSelector} ${symbolSelector}`,
      symbols => symbols.map(symbol => symbol.textContent),
    )
    this.filter.instruments.slice(0, 6).forEach((instrument, i) => {
      if (loadedSymbols[i] !== instrument.name) {
        throw new Error(`Failed loading instrument ${instrument.name}!`)
      }
    })
  }
}

module.exports = Chart
