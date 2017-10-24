const MongoClient = require('mongodb').MongoClient

const mongoUri = 'mongodb://localhost:27017/drymoose'

class MongoLogger {
  async connect() {
    this.db = await MongoClient.connect(mongoUri)
  }

  listen(sniffer) {
    [
      'closingPrices',
      'displayDatas',
      'instruments',
      'instrumentTypes',
      'exchangeInfo',
      'stocksIndustries',
      'rates',
      'privateInstruments',
      'insights',
    ].forEach(event => {
      sniffer.on(event, docs => this.logMany(event, docs))
    })
    sniffer.on('activityStates', this.logActivityState.bind(this))
  }

  async logOne(collection, doc) {
    await this.db.collection(collection).insertOne(
      { Date: new Date(), ...doc }
    )
  }

  async logMany(collection, docs) {
    const date = new Date()
    await this.db.collection(collection).insertMany(
      docs.map(doc => ({ Date: date, ...doc }))
    )
  }

  async logActivityState(activityStates) {
    const date = new Date()
    await this.db.collection('activityStates').insertMany(
      Object.keys(activityStates).map(InstrumentId => ({
        Date: date,
        InstrumentId,
        ActivityState: activityStates[InstrumentId],
      }))
    )
  }
}

module.exports = MongoLogger