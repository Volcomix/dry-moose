const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')

const { io } = require('./server')
const Bot = require('./bot')

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

class Ai extends Bot {
  constructor(page) {
    super(page)
    io.on('connection', socket => {
      socket.emit('learningData', this.data)
      socket.emit('learningHistory', this.history)
    })
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

  async learn(data) {
    if (learningBackend === 'node') {
      await learn(data, learningBackend, synchronizeUi, this)
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
      await page.evaluate(learn, data, learningBackend, synchronizeUi)
    }
  }
}

function learn(data, learningBackend, synchronizeUi, ai) {
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

    async learn(data) {
      const prices = Object.values(data)[0]

      const features = this.getFeatures(prices)
      const target = this.getTarget(prices)

      const standardized = this.standardize(features)

      this.data = [
        await this.getData(features),
        await this.getData(standardized),
        await this.getData(target),
      ]

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

      // const optimizer = tf.train.sgd(0.2)
      const optimizer = tf.train.momentum(0.2, 0.5)
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
      for (let i = 1; i < 100; i++) {
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

      tf.dispose([features, target, standardized])
    }

    getFeatures(prices) {
      return tf.tensor2d(
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
    }

    getTarget(prices) {
      return tf.tensor1d(
        prices
          .map(
            (price, i) =>
              i + 3 >= prices.length
                ? undefined
                : Math.sign(prices[i + 3].Close - prices[i].Close),
          )
          .slice(4, prices.length - 3),
      )
    }

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

  return new Ai().learn(data)
}

module.exports = Ai
