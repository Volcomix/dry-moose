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
  }

  get isPlayable() {
    return this.activityStates
      && this.instruments
      && this.closingPrices
      && this.privateInstruments
  }

  async updateBidAskSpreads() {
    const bidAskSpreads = this.playableInstruments.map(
      id => {
        const rates = this.rates[id]
        const percent = (rates.Ask - rates.Bid) / rates.Ask
        const amount = percent * this.privateInstruments[id].MinPositionAmount
        return {
          InstrumentId: id,
          Percent: percent,
          Amount: amount,
        }
      }
    )
    await this.logger.logMany('bidAskSpreads', bidAskSpreads)
    this.bidAskSpreads = bidAskSpreads.reduce(
      (bidAskSpreads, bidAskSpread) => {
        bidAskSpreads[bidAskSpread.instrumentId] = bidAskSpread
        return bidAskSpreads
      }, {}
    )
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
}

module.exports = Bot