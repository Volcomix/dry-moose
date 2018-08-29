const puppeteer = require('puppeteer')

const Router = require('./router')

const headless = false

/** Set undefined to run a bundled version of Chromium */
const executablePath = 'google-chrome-unstable'
const userDataDir = './user-data'

class Browser extends Router {
  constructor(io) {
    super(
      io,
      '/browser',
      {
        start: () => this.start(),
        stop: () => this.stop(),
      },
      {
        status: [false],
      },
    )
  }

  get browser() {
    return this._browser
  }

  set browser(browser) {
    this._browser = browser
    this.emit('status', !!browser)
  }

  async start() {
    if (this.browser) {
      await this.stop()
    }
    console.log('Starting browser...')
    this.browser = await puppeteer.launch({
      executablePath,
      userDataDir,
      headless,
    })
    this.browser.on('disconnected', () => this.disconnected())
    console.log('Browser started.')
  }

  async stop() {
    if (!this.browser) {
      console.warn('Browser is already stopped!')
      return
    }
    console.log('Stopping browser...')
    await this.browser.close()
    console.log('Browser stopped.')
  }

  disconnected() {
    this.browser = undefined
    console.log('Browser disconnected.')
  }
}

module.exports = Browser
