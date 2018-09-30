const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const Router = require('./Router')

const mouseSpeed = 250
const mouseDelay = 250
const keySpeed = 100

class Bot extends Router {
  async sleep(timeout) {
    await setTimeoutPromise(timeout)
  }

  async waitForMouse() {
    await this.sleep(mouseSpeed)
  }

  async click(selector, options) {
    await this.waitForMouse()
    await this.page.waitForSelector(selector)
    await this.page.click(selector, { delay: mouseDelay, ...options })
  }

  async type(selector, text) {
    await this.click(selector, { clickCount: 3 })
    await this.page.type(selector, text, { delay: keySpeed })
  }
}

module.exports = Bot
