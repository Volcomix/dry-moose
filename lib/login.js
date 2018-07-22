const { urlBase } = require('./etoro')
const Bot = require('./bot')

const url = `${urlBase}/watchlists`
const backdropCloseDelay = 1000
const backdropCloseSelector = '.inmplayer-popover-close-button'

class Login extends Bot {
  async wait() {
    console.log('Waiting for login...')
    await this.page.goto(url)
    while (this.page.url() !== url) {
      await this.page.waitForNavigation()
    }
    console.log('Logged in.')
    await this.closeBackdrop()
  }

  async closeBackdrop() {
    await this.sleep(backdropCloseDelay)
    const closeHandle = await this.page.$(backdropCloseSelector)
    if (closeHandle) {
      console.log('Closing backdrop...')
      await this.click(backdropCloseSelector)
      console.log('Backdrop closed.')
    } else {
      console.log('No backdrop.')
    }
  }
}

module.exports = Login
