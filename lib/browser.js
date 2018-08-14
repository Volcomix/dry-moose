const puppeteer = require('puppeteer')

const { urlBase } = require('./etoro')

/** Set undefined to run a bundled version of Chromium */
const executablePath = 'google-chrome-unstable'

const viewport = { width: 1800, height: 800 }

class Browser {
  constructor(io) {
    this.io = io.of('/browser').on('connection', socket => {
      socket.emit('status', !!this.page)
      socket.on('start', () => this.start())
    })
  }

  async start() {
    if (this.page) {
      console.log('Browser already started.')
      return this.page
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
    this.io.emit('status', true)
    return this.page
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
