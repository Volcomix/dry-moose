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
    await this.updateBidAskSpreads()
    const instruments = this.getBestInstruments()
    console.log(instruments)
  }

  get isPlayable() {
    return this.activityStates
      && this.instruments
      && this.closingPrices
      && this.privateInstruments
  }

  get playableInstruments() {
    return Object.keys(this.instruments).filter(
      id => (
        this.activityStates[id].ActivityState === true
        && this.instruments[id].IsDelisted === false
        && this.closingPrices[id].IsMarketOpen === true
        && this.privateInstruments[id].MinPositionAmountAbsolute <= maxBet
      )
    )
  }

  async updateBidAskSpreads() {
    const bidAskSpreads = this.playableInstruments.map(
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

  getBestInstruments() {
    const bidAskSpreads = Object.keys(this.bidAskSpreads).sort(
      (a, b) => this.bidAskSpreads[a].Amount - this.bidAskSpreads[b].Amount
    )
    return bidAskSpreads.slice(0, 12)
  }
}

module.exports = Bot