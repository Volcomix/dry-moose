const EventEmitter = require('events')

const maxBet = 50
const maxBidAskSpreadAmount = 1

class InstrumentPicker extends EventEmitter {
  constructor(logger) {
    super()
    this.logger = logger
  }

  listen(sniffer) {
    sniffer.on('data', this.receive.bind(this))
  }

  async receive(name, data) {
    this[name] = data.reduce((docs, doc) => {
      let key = 'instrumentId'
      if (!doc[key]) {
        key = Object.keys(doc).find(key => key.endsWith('Id'))
      }
      docs[doc[key]] = doc
      return docs
    }, {})
    if (['rates', 'privateInstruments'].includes(name)) {
      await this.update()
    }
  }

  async update() {
    if (!this.isPlayable) {
      return
    }
    await this.updateMinAmounts()
    await this.updateBidAskSpreads()
    const bestInstruments = this.bestInstruments
    this.logger.logOne('bestInstruments', { bestInstruments })
    this.emit('pick', this, bestInstruments)
  }

  get isPlayable() {
    const isDataAvailable = this.activityStates
      && this.instruments
      && this.closingPrices
      && this.privateInstruments
    if (isDataAvailable) {
      const ratesLength = Object.keys(this.rates).length
      const privateInstrumentsLength = Object.keys(this.privateInstruments).length
      console.log('ratesLength:', ratesLength)
      console.log('privateInstrumentsLength:', privateInstrumentsLength)
      return privateInstrumentsLength >= ratesLength
    }
    return false
  }

  async updateMinAmounts() {
    const minAmounts = Object.keys(this.privateInstruments).map(
      instrumentId => this.getMinAmount(instrumentId)
    )
    await this.logger.logMany('minAmounts', minAmounts)
    this.minAmounts = minAmounts.reduce(
      (minAmounts, minAmount) => {
        minAmounts[minAmount.instrumentId] = minAmount
        return minAmounts
      }, {}
    )
  }

  getMinAmount(instrumentId) {
    const privateInstrument = this.privateInstruments[instrumentId]
    const maxLeverage = Math.max(...privateInstrument.leverages)
    return {
      instrumentId: +instrumentId,
      minAmount: Math.max(
        privateInstrument.minPositionAmount / maxLeverage,
        privateInstrument.minPositionAmountAbsolute,
      ),
    }
  }

  async updateBidAskSpreads() {
    const bidAskSpreads = Object.keys(this.rates).map(
      instrumentId => this.getBidAskSpread(instrumentId)
    )
    await this.logger.logMany('bidAskSpreads', bidAskSpreads)
    this.bidAskSpreads = bidAskSpreads.reduce(
      (bidAskSpreads, bidAskSpread) => {
        bidAskSpreads[bidAskSpread.instrumentId] = bidAskSpread
        return bidAskSpreads
      }, {}
    )
  }

  getBidAskSpread(instrumentId) {
    try {
      const { bid, ask } = this.rates[instrumentId]
      const { minPositionAmount } = this.privateInstruments[instrumentId]
      const percent = (ask - bid) / ask
      const amount = percent * minPositionAmount
      return { instrumentId: +instrumentId, percent, amount }
    } catch (error) {
      console.log(this.privateInstruments)
      console.error('Error getting bid/ask spread for:', instrumentId)
      throw error
    }
  }

  get bestInstruments() {
    return Object.keys(this.instruments)
      .filter(id =>
        this.activityStates[id].activityState === true
        && this.instruments[id].isDelisted === false
        && this.closingPrices[id].isMarketOpen === true
        && this.minAmounts[id].minAmount <= maxBet
        && this.bidAskSpreads[id].amount <= maxBidAskSpreadAmount
      )
      .sort((a, b) =>
        this.bidAskSpreads[a].percent - this.bidAskSpreads[b].percent
      )
      .slice(0, 12)
      .map(id => +id)
  }
}

module.exports = InstrumentPicker