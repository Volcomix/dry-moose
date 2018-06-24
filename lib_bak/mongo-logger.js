const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'drymoose'

class MongoLogger {
  async connect() {
    const client = await MongoClient.connect(url)
    this.db = client.db(dbName)
  }

  logOne(collection, doc) {
    return this.db.collection(collection).insertOne(
      { date: new Date(), ...doc }
    )
  }

  logMany(collection, docs) {
    const date = new Date()
    return this.db.collection(collection).insertMany(
      docs.map(doc => ({ date, ...doc }))
    )
  }
}

module.exports = MongoLogger