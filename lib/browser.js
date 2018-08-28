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
      },
      {
        status: [false],
      },
    )
  }

  get isStarted() {
    return !!this.page
  }

  async start() {
    if (this.isStarted) {
      return console.warn('Browser is already started!')
    }
    console.log('Starting browser...')
    const browser = await puppeteer.launch({
      executablePath,
      userDataDir: './user-data',
      headless: false,
      args: ['--start-maximized'],
    })
    browser.on('targetcreated', this.setViewport)
    const pages = await browser.pages()
    this.page = pages[0]
    await this.bypassAutomationCheck(this.page)
    await this.page.setViewport(viewport)
    console.log('Browser started.')
    this.emit('status', true)
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
