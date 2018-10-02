const Router = require('./Router')

const Events = {
  Filter: 'Filter',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Filtering: 'Filtering',
  Filtered: 'Filtered',
}

class Filter extends Router {
  constructor(market, io) {
    const config = {
      filterActiveInstruments: true,

      /** -1 to disable */
      maxAmountFilter: 100,

      /** 'percent' or 'amount' */
      spreadSortingMode: 'percent',

      instrumentsCount: 6,
    }
    const routes = {
      [Events.Filter]: () => this.filter(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/filter', routes, events, config)
    this.market = market
  }

  filter() {
    if (!this.market.instruments) {
      console.warn('Market not discovered, instruments could not be filtered!')
      return
    }
    this.emit(Events.Status, Status.Filtering)
    console.log('Filtering instruments...')
    let instruments = this.market.instruments
    if (this.config.filterActiveInstruments) {
      instruments = this.active(instruments)
    }
    if (this.config.maxAmountFilter > -1) {
      instruments = this.belowAmount(instruments)
    }
    switch (this.config.spreadSortingMode) {
      case 'percent':
        instruments = this.sortBySpreadPercent(instruments)
        break
      case 'amount':
        instruments = this.sortBySpreadAmount(instruments)
        break
      default:
        throw new Error('Wrong spread sorting mode!')
    }
    this.instruments = instruments.slice(0, this.config.instrumentsCount)
    this.emit(Events.Status, Status.Filtered, this.instruments)
    console.log(`${this.instruments.length} instruments filtered.`)
  }

  active(instruments) {
    return instruments.filter(
      instrument => instrument.isActive && instrument.isMarketOpen,
    )
  }

  belowAmount(instruments) {
    return instruments.filter(
      instrument => instrument.minAmount <= this.config.maxAmountFilter,
    )
  }

  sortBySpreadPercent(instruments) {
    return instruments.sort((a, b) => a.spreadPercent - b.spreadPercent)
  }

  sortBySpreadAmount(instruments) {
    return instruments.sort((a, b) => a.spreadAmount - b.spreadAmount)
  }
}

module.exports = Filter
