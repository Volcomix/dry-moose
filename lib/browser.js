const puppeteer = require('puppeteer')

const { urlBase } = require('./etoro')
const Router = require('./router')

/** Set undefined to run a bundled version of Chromium */
const executablePath = 'google-chrome-unstable'

const viewport = { width: 1800, height: 800 }

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
      userDataDir: './user-data',
      headless: false,
    })
    this.browser.on('disconnected', () => {
      this.browser = undefined
      console.log('Browser disconnected.')
    })
    this.browser.on('targetcreated', this.setViewport)
    const pages = await this.browser.pages()
    this.page = pages[0]
    await this.bypassAutomationCheck(this.page)
    await this.page.setViewport(viewport)
    console.log('Browser started.')
  }

  async stop() {
    if (!this.browser) {
      console.warn('Browser is already stopped!')
      return
    }
    console.log('Stopping browser...')
    await this.browser.close()
    this.browser = undefined
    console.log('Browser stopped.')
  }

  async bypassAutomationCheck(page) {
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false })
    })
  }

  async setViewport(target) {
    if (target.type() === 'page' && target.url().startsWith(urlBase)) {
      const page = await target.page()
      await page.setViewport(viewport)
    }
  }
}

module.exports = Browser
