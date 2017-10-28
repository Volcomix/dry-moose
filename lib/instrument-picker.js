const EventEmitter = require('events')

const maxBet = 500

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
    this.emit('pick', new Set(bestInstruments.map(
      id => this.displayDatas[id].symbolFull
    )))
  }

  get isPlayable() {
    return this.activityStates
      && this.instruments
      && this.closingPrices
      && this.privateInstruments
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
    const rates = this.rates[instrumentId]
    const instrument = this.privateInstruments[instrumentId]
    const percent = (rates.ask - rates.bid) / rates.ask
    const amount = percent * instrument.minPositionAmount
    return { instrumentId: +instrumentId, percent, amount }
  }

  get bestInstruments() {
    return Object.keys(this.instruments)
      .filter(id =>
        this.activityStates[id].activityState === true
        && this.instruments[id].isDelisted === false
        && this.closingPrices[id].isMarketOpen === true
        && this.minAmounts[id].minAmount <= maxBet
      )
      .sort((a, b) =>
        this.bidAskSpreads[a].amount - this.bidAskSpreads[b].amount
      )
      .slice(0, 12)
  }
}

module.exports = InstrumentPicker