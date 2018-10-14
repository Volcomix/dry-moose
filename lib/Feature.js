const Router = require('./Router')

const Events = {
  Select: 'Select',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Selecting: 'Selecting',
  Selected: 'Selected',
}

class Feature extends Router {
  constructor(price, io) {
    const routes = {
      [Events.Select]: () => this.select(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/feature', routes, events)
    this.price = price
  }

  select() {
    if (!this.price.prices) {
      console.warn('Prices not read, features could not be selected!')
      return
    }
    this.emit(Events.Status, Status.Selecting)
    console.log('Selecting features...')
    this.features = Object.entries(this.price.prices).reduce(
      (result, [symbol, prices]) => {
        result[symbol] = this.selectSymbolFeatures(prices)
        return result
      },
      {},
    )
    this.emit(Events.Status, Status.Selected, this.features)
    console.log('Features selected.')
  }

  selectSymbolFeatures(prices) {
    return prices
      .map((price, index) => {
        const features = {
          date: price.date,
          target: this.direction(prices, index, 3),
        }
        for (let offset = 1; offset <= 4; offset++) {
          features[`change-${offset}`] = this.change(prices, index, offset)
          features[`range-${offset}`] = this.range(prices, index, offset)
        }
        return features
      })
      .filter(features =>
        Object.values(features).every(feature => feature !== null),
      )
  }

  change(prices, index, offset) {
    if (offset > index) {
      return null
    }
    const currentPrice = prices[index]
    const offsetPrice = prices[index - offset]
    const { periodicity, unit } = this.price.periodicity
    const diff = currentPrice.date.diff(offsetPrice.date, unit)
    if (diff !== periodicity * offset) {
      return null
    }
    return (currentPrice.close - offsetPrice.close) / currentPrice.close
  }

  range(prices, index, offset) {
    if (offset > index) {
      return null
    }
    const currentPrice = prices[index]
    const offsetPrice = prices[index - offset]
    const { periodicity, unit } = this.price.periodicity
    const diff = currentPrice.date.diff(offsetPrice.date, unit)
    if (diff !== periodicity * offset) {
      return null
    }
    const highest = this.highest(prices, index, offset)
    const lowest = this.lowest(prices, index, offset)
    return (highest - lowest) / currentPrice.close
  }

  direction(prices, index, offset) {
    if (index + offset >= prices.length) {
      return null
    }
    const currentPrice = prices[index]
    const offsetPrice = prices[index + offset]
    const { periodicity, unit } = this.price.periodicity
    const diff = offsetPrice.date.diff(currentPrice.date, unit)
    if (diff !== periodicity * offset) {
      return null
    }
    return Math.sign(offsetPrice.close - currentPrice.close)
  }

  highest(prices, index, offset) {
    return Math.max(
      ...prices.slice(index - offset, index + 1).map(price => price.high),
    )
  }

  lowest(prices, index, offset) {
    return Math.min(
      ...prices.slice(index - offset, index + 1).map(price => price.low),
    )
  }
}

module.exports = Feature
