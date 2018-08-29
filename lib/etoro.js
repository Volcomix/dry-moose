// Must be defined before requiring ./login
exports.urlBase = 'https://www.etoro.com'

const Router = require('./router')
const Login = require('./login')
const DemoMode = require('./demo-mode')

const viewport = { width: 1800, height: 800 }

class EToro extends Router {
  constructor(browser, io) {
    super(
      io,
      '/eToro',
      {
        start: () => this.start(),
        stop: () => this.stop(),
      },
      {
        status: ['stopped'],
      },
    )
    this.browser = browser
  }

  async start() {
    if (!this.browser.browser) {
      console.warn('Browser is stopped, eToro could not be started!')
      return
    }
    if (this.page) {
      await this.stop()
    }
    console.log('Starting eToro...')
    this.emit('status', 'open')
    const page = await this.open()
    this.emit('status', 'login')
    const login = new Login(page)
    await login.wait()
    this.emit('status', 'backdrop')
    await login.closeBackdrop()
    this.emit('status', 'demoMode')
    await new DemoMode(page).set()
    this.emit('status', 'started')
    console.log('eToro started.')
  }

  async stop() {
    if (!this.page) {
      console.warn('eToro is alread stopped!')
      return
    }
    console.log('Stopping eToro...')
    await this.page.close()
    console.log('eToro stopped.')
  }

  async open() {
    console.log('Opening eToro page...')
    const { browser } = this.browser
    browser.on('targetcreated', this.setViewport)
    this.page = await browser.newPage()
    this.page.on('close', () => this.closed())
    await this.bypassAutomationCheck(this.page)
    await this.page.setViewport(viewport)
    console.log('eToro page open.')
    return this.page
  }

  closed() {
    this.page = undefined
    this.browser.browser.removeListener('targetcreated', this.setViewport)
    this.emit('status', 'stopped')
    console.log('eToro page closed.')
  }

  async bypassAutomationCheck(page) {
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false })
    })
  }

  async setViewport(target) {
    if (target.type() === 'page' && target.url().startsWith(EToro.urlBase)) {
      const page = await target.page()
      await page.setViewport(viewport)
    }
  }
}

module.exports = Object.assign(EToro, exports)
