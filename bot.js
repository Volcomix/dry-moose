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
  }
}

module.exports = Bot