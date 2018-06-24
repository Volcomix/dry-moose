const MongoClient = require('mongodb').MongoClient

const mongoUri = 'mongodb://localhost:27017/drymoose'

class Learn {
  async main() {
    const db = await MongoClient.connect(mongoUri)
    const realtime = db.collection('realtime')
      .find({
        instrumentId: 1118,
        date: {
          $gte: new Date('2017-11-01T17:30:00.000Z'),
          $lte: new Date('2017-11-01T19:15:00.000Z'),
        },
      })
      .project({ _id: 0 })
    const ticks = await realtime.toArray()
    const start = ticks[0].date.setMilliseconds(0) + 1000
    const end = ticks[ticks.length - 1].date.setMilliseconds(0)
    for (let t = start, i = 1; t < end; t += 1000, i++) {
      const time = ticks[i].date.setMilliseconds(0)
      for (; t < time; t += 1000, i++) {
        ticks.splice(i, 0, { ...ticks[i - 1], date: new Date(t) })
      }
    }

    const barsPast = 30
    const barsNext = 180
    for (let i = 0; i < ticks.length; i++) {
      if (i < barsPast || i > ticks.length - barsNext - 1) {
        continue
      }
      const changed = (ticks[i].bid - ticks[i - barsPast].bid) / ticks[i].bid
      const normalizedChanged = Math.min(Math.max(changed, -1), 1)
      ticks[i].changed = normalizedChanged

      let min = ticks[i].bid
      let max = min
      for (let j = i - barsPast; j < i; j++) {
        const bid = ticks[j].bid
        if (bid < min) {
          min = bid
        } else if (bid > max) {
          max = bid
        }
      }
      const range = (max - min) / ticks[i].bid
      const normalizedRange = Math.min(Math.max(range, -1), 1)
      ticks[i].range = normalizedRange

      const change = (ticks[i + barsNext].bid - ticks[i].bid) / ticks[i].bid
      const normalizedChange = Math.min(Math.max(change, -1), 1)
      ticks[i].change = normalizedChange
    }
    console.log(ticks.slice(500, 600))
    await db.close()
  }
}

new Learn().main()