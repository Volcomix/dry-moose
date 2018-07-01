const Bot = require('./bot')

const urlBase = 'https://www.etoro.com'
const loginUrl = `${urlBase}/login`
const landingUrl = `${urlBase}/watchlists`
const backdropCloseDelay = 1000
const backdropCloseSelector = '.inmplayer-popover-close-button'

class Login extends Bot {
  async wait() {
    console.log('Waiting for login...')
    await this.page.goto(loginUrl)
    while (this.page.url() !== landingUrl) {
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
