const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')
const moment = require('moment')

const { io } = require('./server')
const Bot = require('./Bot')

/** 'node' or 'browser' */
const learningBackend = 'browser'

const synchronizeUi = true

const tfjsUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs'

const learningPageContent = `
<html>
  <head><title>Learning...</title></head>
  <body>Learning...</body>
</html>
`

class AI extends Bot {
  constructor(page) {
    super(page)
    io.on('connection', socket => {
      socket.emit('learningInputs', this.inputs)
      socket.emit('learningData', this.data)
      socket.emit('learningHistory', this.history)
      socket.emit('learningPredictions', this.predictions)
    })
    this.inputs = undefined
    this.data = undefined
    this.history = undefined
    this.predictions = undefined
  }

  get inputs() {
    return this._inputs
  }

  set inputs(inputs) {
    this._inputs = inputs
    io.emit('learningInputs', inputs)
  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = data
    io.emit('learningData', data)
  }

  get history() {
    return this._history
  }

  set history(history) {
    this._history = history
    io.emit('learningHistory', history)
  }

  get predictions() {
    return this._predictions
  }

  set predictions(predictions) {
    this._predictions = predictions
    io.emit('learningPredictions', predictions)
  }

  async learn(data) {
    const prices = Object.values(data)[0]
    this.inputs = this.getInputs(prices)
    const features = this.inputs.map(input =>
      Object.entries(input)
        .filter(([key]) => !['date', 'target'].includes(key))
        .map(([key, value]) => value),
    )
    const target = this.inputs.map(input => input.target)

    console.time('Learning')
    if (learningBackend === 'node') {
      await learn(features, target, learningBackend, synchronizeUi, this)
    } else {
      const browser = await this.page.browser()
      const page = await browser.newPage()
      await page.setContent(learningPageContent)
      await page.addScriptTag({ url: tfjsUrl })
      await page.exposeFunction('setData', data => {
        this.data = data
      })
      await page.exposeFunction('setHistory', history => {
        this.history = history
      })
      await page.exposeFunction('setPredictions', predictions => {
        this.predictions = predictions
      })
      await page.evaluate(
        learn,
        features,
        target,
        learningBackend,
        synchronizeUi,
      )
    }
    console.timeEnd('Learning')
  }

  getInputs(prices) {
    return prices
      .map((price, i) => {
        const input = {
          date: moment.utc(price.Date, 'YYYYMMDDHHmm'),
          target: this.direction(prices, i, 3),
        }
        for (let j = 1; j <= 4; j++) {
          input[`change-${j}`] = this.change(prices, i, j)
        }
        for (let j = 1; j <= 4; j++) {
          input[`range-${j}`] = this.range(prices, i, j)
        }
        return input
      })
      .filter(input => Object.values(input).every(value => value !== null))
  }

  change(prices, i, n) {
    if (n > i) {
      return null
    }
    const currentDate = moment.utc(prices[i].Date, 'YYYYMMDDHHmm')
    const offsetDate = moment.utc(prices[i - n].Date, 'YYYYMMDDHHmm')
    if (currentDate.diff(offsetDate, 'minutes') !== 10 * n) {
      return null
    }
    return (prices[i].Close - prices[i - n].Close) / prices[i].Close
  }

  range(prices, i, n) {
    if (n > i) {
      return null
    }
    const currentDate = moment.utc(prices[i].Date, 'YYYYMMDDHHmm')
    const offsetDate = moment.utc(prices[i - n].Date, 'YYYYMMDDHHmm')
    if (currentDate.diff(offsetDate, 'minutes') !== 10 * n) {
      return null
    }
    return (
      (this.highest(prices, i, n) - this.lowest(prices, i, n)) / prices[i].Close
    )
  }

  direction(prices, i, n) {
    if (i + n >= prices.length) {
      return null
    }
    const currentDate = moment.utc(prices[i].Date, 'YYYYMMDDHHmm')
    const offsetDate = moment.utc(prices[i + n].Date, 'YYYYMMDDHHmm')
    if (offsetDate.diff(currentDate, 'minutes') !== 10 * n) {
      return null
    }
    return Math.sign(prices[i + n].Close - prices[i].Close)
  }

  highest(prices, i, n) {
    return Math.max(...prices.slice(i - n, i + 1).map(price => price.High))
  }

  lowest(prices, i, n) {
    return Math.min(...prices.slice(i - n, i + 1).map(price => price.Low))
  }
}

function learn(features, target, learningBackend, synchronizeUi, ai) {
  class Ai {
    set data(data) {
      if (learningBackend === 'node') {
        ai.data = data
      } else {
        window.setData(data)
      }
    }

    get history() {
      return this._history
    }

    set history(history) {
      this._history = history
      if (learningBackend === 'node') {
        ai.history = history
      } else {
        window.setHistory(history)
      }
    }

    get predictions() {
      return this._predictions
    }

    set predictions(predictions) {
      this._predictions = predictions
      if (learningBackend === 'node') {
        ai.predictions = predictions
      } else {
        window.setPredictions(predictions)
      }
    }

    async learn(features, target) {
      const standardized = this.standardize(features)
      this.data = [await this.getData(standardized)]

      const model = tf.sequential({
        layers: [
          tf.layers.dense({
            units: 30,
            activation: 'tanh',
            kernelInitializer: 'VarianceScaling',
            inputShape: [8],
          }),
          tf.layers.dense({
            units: 30,
            activation: 'tanh',
            kernelInitializer: 'VarianceScaling',
          }),
          tf.layers.dense({
            units: 30,
            activation: 'tanh',
            kernelInitializer: 'VarianceScaling',
          }),
          tf.layers.dense({
            units: 1,
            activation: 'tanh',
            kernelInitializer: 'VarianceScaling',
          }),
        ],
      })

      // const optimizer = tf.train.sgd(0.2)
      const optimizer = tf.train.momentum(0.2, 0.95)
      // const optimizer = tf.train.momentum(0.2, 0.5, true)
      // const optimizer = tf.train.adagrad(0.2)
      // const optimizer = tf.train.adadelta(0.2, 0.5)
      // const optimizer = tf.train.rmsprop(0.2)

      model.compile({
        loss: 'meanSquaredError',
        optimizer,
        metrics: ['accuracy'],
      })
      model.summary()

      this.history = []
      for (let i = 0; i <= 20; i++) {
        const history = await model.fit(standardized, target, {
          batchSize: 1000,
          epochs: 100,
          validationSplit: 0.1,
        })
        const loss = history.history.loss[0]
        const accuracy = history.history.acc[0]

        console.log(`Epoch ${i} - Loss: ${loss} - Accuracy: ${accuracy}`)
        this.history = [...this.history, { epoch: i, loss, accuracy }]

        await this.nextFrame()
      }

      const predictions = model.predict(standardized)

      const outputData = await this.getData(predictions)
      const targetData = await this.getData(target)
      this.predictions = outputData
        .map((prediction, i) => ({
          prediction: prediction[0],
          target: targetData[i][0],
        }))
        .slice(outputData.length * 0.9)

      tf.dispose([features, target, standardized, predictions])
    }

    minMaxNormalize(features) {
      const min = features.min()
      return features
        .sub(min)
        .div(features.max().sub(min))
        .mul(2)
        .sub(1)
    }

    meanNormalize(features) {
      return features
        .sub(features.mean())
        .div(features.max().sub(features.min()))
    }

    standardize(features) {
      const { mean, variance } = tf.moments(features)
      return features.sub(mean).div(variance.sqrt())
    }

    async getData(features) {
      const data = await features.data()
      if (features.shape.length === 1) {
        return Array.from(data).map(value => ({ '0': value }))
      } else {
        const [width, height] = features.shape
        const data2d = []
        for (let x = 0; x < width; x++) {
          data2d.push(data.slice(x * height, (x + 1) * height))
        }
        return data2d
      }
    }

    async nextFrame() {
      if (learningBackend === 'node' && synchronizeUi) {
        await ai.sleep(100)
      } else {
        await tf.nextFrame()
      }
    }
  }

  return new Ai().learn(tf.tensor2d(features), tf.tensor1d(target))
}

module.exports = AI
