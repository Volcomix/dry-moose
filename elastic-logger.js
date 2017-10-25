const elasticsearch = require('elasticsearch')

class ElasticLogger {
  constructor() {
    this.client = new elasticsearch.Client()
  }

  get index() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return `drymoose-${year}-${month}-${day}`
  }

  logOne(type, doc) {
    return this.client.index({
      index: this.index,
      type,
      body: {
        Date: new Date(),
        ...doc,
      },
    })
  }

  async logMany(type, docs) {
    const date = new Date()
    return this.client.bulk({
      body: docs.reduce((body, doc) => {
        body.push(
          { index: { _index: this.index, _type: type } },
          { Date: date, ...doc },
        )
        return body
      }, []),
    })
  }
}

module.exports = ElasticLogger