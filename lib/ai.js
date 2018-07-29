const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')

const { io } = require('./server')

class Ai {
  constructor() {
    io.on('connection', socket => {
      socket.emit('learning', this.data)
    })
  }

  async learn(data) {
    const prices = Object.values(data)[0]
    const features = tf.tensor2d(
      prices
        .map((price, i) => {
          const feature = []
          for (let j = 1; j <= 4; j++) {
            feature.push(this.change(prices, i, j))
          }
          for (let j = 1; j <= 4; j++) {
            feature.push(this.range(prices, i, j))
          }
          return feature
        })
        .slice(4, prices.length - 3),
    )
    features.print()

    const target = tf.tensor1d(
      prices
        .map(
          (price, i) =>
            i + 3 >= prices.length
              ? undefined
              : Math.sign(prices[i + 3].Close - prices[i].Close),
        )
        .slice(4, prices.length - 3),
    )
    target.print()

    console.log(features.shape, target.shape)

    // const model = tf.sequential()
    // model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
    // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })
    // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1])
    // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1])
    // model.fit(xs, ys, { epochs: 10 }).then(() => {
    //   model.predict(tf.tensor2d([5], [1, 1])).print()
    // })

    const [width, height] = features.shape

    const min = features.min()
    const max = features.max()
    const mean = features.mean()

    const rescaled = features
      .sub(min)
      .div(max.sub(min))
      .mul(2)
      .sub(1)
    rescaled.print()

    const meanNormalized = features.sub(mean).div(max.sub(min))
    meanNormalized.print()

    const standardized = features.sub(mean).div(
      features
        .sub(mean)
        .pow(2)
        .sum()
        .div(width)
        .sqrt(),
    )
    standardized.print()

    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          units: 30,
          activation: 'relu',
          kernelInitializer: 'VarianceScaling',
          inputShape: [8],
        }),
        tf.layers.dense({
          units: 30,
          activation: 'relu',
          kernelInitializer: 'VarianceScaling',
        }),
        tf.layers.dense({
          units: 30,
          activation: 'relu',
          kernelInitializer: 'VarianceScaling',
        }),
        tf.layers.dense({
          units: 1,
          activation: 'tanh',
          kernelInitializer: 'VarianceScaling',
        }),
      ],
    })
    const optimizer = tf.train.sgd(0.2)
    model.compile({
      loss: 'meanSquaredError',
      optimizer,
      metrics: ['accuracy'],
    })
    model.summary()
    for (let i = 1; i < 1000; i++) {
      const history = await model.fit(rescaled, target, {
        batchSize: 1000,
        epochs: 100,
        validationSplit: 0.1,
      })
      console.log(
        `Epoch ${i} -`,
        `Loss: ${history.history.loss[0]} -`,
        `Accuracy: ${history.history.acc[0]}`,
      )
    }

    const featuresData = await features.data()
    const featuresData2d = []
    for (let x = 0; x < width; x++) {
      featuresData2d.push(featuresData.slice(x * height, (x + 1) * height))
    }

    const rescaledData = await rescaled.data()
    const rescaledData2d = []
    for (let x = 0; x < width; x++) {
      rescaledData2d.push(rescaledData.slice(x * height, (x + 1) * height))
    }

    const meanNormalizedData = await meanNormalized.data()
    const meanNormalizedData2d = []
    for (let x = 0; x < width; x++) {
      meanNormalizedData2d.push(
        meanNormalizedData.slice(x * height, (x + 1) * height),
      )
    }

    const standardizedData = await standardized.data()
    const standardizedData2d = []
    for (let x = 0; x < width; x++) {
      standardizedData2d.push(
        standardizedData.slice(x * height, (x + 1) * height),
      )
    }

    const targetData = await target.data()

    tf.dispose([features, target, rescaled, meanNormalized, standardized])

    this.data = [
      featuresData2d,
      rescaledData2d,
      // meanNormalizedData2d,
      // standardizedData2d,
      Array.from(targetData).map(value => ({ '0': value })),
    ]

    io.emit('learning', this.data)
  }

  // var change(int n) {
  //   return scale((priceClose(0) - priceClose(n))/priceClose(0),100)/100;
  // }

  // var range(int n) {
  //   return scale((HH(n) - LL(n))/priceClose(0),100)/100;
  // }

  // The two functions are supposed to carry the necessary information for
  // price action: per-bar movement and volatility.
  // The change function is the difference of the current price to
  // the price of n bars before, divided by the current price.
  // The range function is the total high-low distance of the last n candles,
  // also in divided by the current price. And the scale function centers and
  // compresses the values to the +/-100 range, so we divide them by 100 for
  // getting them normalized to +/-1. We remember that normalizing is needed for
  // machine learning algorithms.

  // function run() {
  //   StartDate = 20140601; // start two years ago
  //   BarPeriod = 60; // use 1-hour bars
  //   LookBack = 100; // needed for scale()

  //   set(RULES);   // generate signals
  //   LifeTime = 3; // prediction horizon
  //   Spread = RollLong = RollShort = Commission = Slippage = 0;

  //   adviseLong(SIGNALS+BALANCED,0,
  //     change(1),change(2),change(3),change(4),
  //     range(1),range(2),range(3),range(4));
  //   enterLong();
  // }

  change(prices, i, n) {
    return n > i
      ? undefined
      : (prices[i].Close - prices[i - n].Close) / prices[i].Close
  }

  range(prices, i, n) {
    return n > i
      ? undefined
      : (this.highest(prices, i, n) - this.lowest(prices, i, n)) /
          prices[i].Close
  }

  highest(prices, i, n) {
    return Math.max(...prices.slice(i - n, i + 1).map(price => price.High))
  }

  lowest(prices, i, n) {
    return Math.min(...prices.slice(i - n, i + 1).map(price => price.Low))
  }
}

module.exports = Ai
