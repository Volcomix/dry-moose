const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const mouseSpeed = 250
const mouseDelay = 250

class Bot {
  constructor(page) {
    this.page = page
  }

  async sleep(timeout) {
    await setTimeoutPromise(timeout)
  }

  async waitForMouse() {
    await this.sleep(mouseSpeed)
  }

  async click(selector) {
    await this.waitForMouse()
    await this.page.click(selector, { delay: mouseDelay })
  }

  async clickToNavigate(selector) {
    await this.waitForMouse()
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(selector, { delay: mouseDelay }),
    ])
  }
}

module.exports = Bot
