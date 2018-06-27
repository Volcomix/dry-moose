const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const etoro = require('./etoro')

const backdropCloseDelay = 5000

const backdropCloseSelector = '.inmplayer-popover-close-button'

class Login {
  constructor(page) {
    this.page = page
  }

  async wait() {
    console.log('Waiting for login...')
    await this.page.goto(etoro.loginUrl)
    while (this.page.url() !== etoro.landingUrl) {
      await this.page.waitForNavigation()
    }
    console.log('Logged in.')
    await this.closeBackdrop()
  }

  async closeBackdrop() {
    await setTimeoutPromise(backdropCloseDelay)
    const closeHandle = await this.page.$(backdropCloseSelector)
    if (closeHandle) {
      console.log('Closing backdrop...')
      await closeHandle.click()
      console.log('Backdrop closed.')
    } else {
      console.log('No backdrop.')
    }
  }
}

module.exports = Login
