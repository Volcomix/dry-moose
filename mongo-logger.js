const MongoClient = require('mongodb').MongoClient

const mongoUri = 'mongodb://localhost:27017/drymoose'

class MongoLogger {
  async connect() {
    this.db = await MongoClient.connect(mongoUri)
  }

  logOne(collection, doc) {
    return this.db.collection(collection).insertOne(
      { Date: new Date(), ...doc }
    )
  }

  logMany(collection, docs) {
    const date = new Date()
    return this.db.collection(collection).insertMany(
      docs.map(doc => ({ Date: date, ...doc }))
    )
  }
}

module.exports = MongoLogger