const maxBet = 50

class Bot {
  constructor(logger) {
    this.logger = logger
  }

  listen(sniffer) {
    sniffer.on('data', this.receive.bind(this))
  }

  async receive(name, data) {
    this[name] = data.reduce((docs, doc) => {
      let key = Object.keys(doc).find(
        key => /^[Ii]nstrumentI[Dd]$/.test(key)
      )
      if (!key) {
        key = Object.keys(doc).find(key => /I[Dd]$/.test(key))
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
    console.log(this.bestInstruments)
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
        minAmounts[minAmount.InstrumentId] = minAmount
        return minAmounts
      }, {}
    )
  }

  getMinAmount(instrumentId) {
    const privateInstrument = this.privateInstruments[instrumentId]
    const maxLeverage = Math.max(...privateInstrument.Leverages)
    return {
      InstrumentId: instrumentId,
      MinAmount: Math.max(
        privateInstrument.MinPositionAmount / maxLeverage,
        privateInstrument.MinPositionAmountAbsolute,
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
        bidAskSpreads[bidAskSpread.InstrumentId] = bidAskSpread
        return bidAskSpreads
      }, {}
    )
  }

  getBidAskSpread(instrumentId) {
    const rates = this.rates[instrumentId]
    const instrument = this.privateInstruments[instrumentId]
    const percent = (rates.Ask - rates.Bid) / rates.Ask
    const amount = percent * instrument.MinPositionAmount
    return {
      InstrumentId: instrumentId,
      Percent: percent,
      Amount: amount,
    }
  }

  get bestInstruments() {
    return Object.keys(this.instruments)
      .filter(id =>
        this.activityStates[id].ActivityState === true
        && this.instruments[id].IsDelisted === false
        && this.closingPrices[id].IsMarketOpen === true
        && this.minAmounts[id].MinAmount <= maxBet
      )
      .sort((a, b) =>
        this.bidAskSpreads[a].Amount - this.bidAskSpreads[b].Amount
      )
      .slice(0, 12)
  }
}

module.exports = Bot