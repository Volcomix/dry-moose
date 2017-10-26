const maxBet = 50

class Bot {
  listen(sniffer) {
    sniffer.on('data', this.receive.bind(this))
  }

  receive(name, data) {
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
      this.update()
    }
  }

  update() {
    if (this.isPlayable) {
      console.log(this.playableInstruments.length)
    }
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
}

module.exports = Bot