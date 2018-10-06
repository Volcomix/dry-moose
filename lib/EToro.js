const Bot = require('./Bot')

const urlBase = 'https://www.etoro.com'
const viewport = { width: 1800, height: 800 }

const url = `${urlBase}/watchlists`
const backdropCloseDelay = 1000
const backdropCloseSelector = '.inmplayer-popover-close-button'
const demoModeSelector = '.i-menu-link-mode-demo'
const switchDemoModeSelector = `${demoModeSelector} .drop-select-box-option:not(.checked)`
const confirmDemoModeSelector = '.uidialog .w-sm-footer-button'

const Events = {
  Start: 'Start',
  Stop: 'Stop',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Open: 'Open',
  Login: 'Login',
  Backdrop: 'Backdrop',
  DemoMode: 'DemoMode',
  Started: 'Started',
}

class EToro extends Bot {
  constructor(browser, io) {
    const config = {
      demoMode: true,
    }
    const routes = {
      [Events.Start]: () => this.start(),
      [Events.Stop]: () => this.stop(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/etoro', routes, events, config)
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
    await this.open()
    await this.waitForLogin()
    await this.closeBackdrop()
    await this.setDemoMode()
    this.emit(Events.Status, Status.Started)
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
    this.emit(Events.Status, Status.Open)
    console.log('Opening eToro page...')
    const { browser } = this.browser
    browser.on('targetcreated', this.setViewport)
    this.page = await browser.newPage()
    this.page.on('close', () => this.closed())
    await this.bypassAutomationCheck(this.page)
    await this.page.setViewport(viewport)
    console.log('eToro page open.')
  }

  closed() {
    this.page = undefined
    this.browser.browser.removeListener('targetcreated', this.setViewport)
    this.emit(Events.Status, Status.Stopped)
    console.log('eToro page closed.')
  }

  async waitForLogin() {
    this.emit(Events.Status, Status.Login)
    console.log('Waiting for login...')
    await this.page.goto(url)
    while (this.page.url() !== url) {
      await this.page.waitForNavigation()
    }
    console.log('Logged in.')
  }

  async closeBackdrop() {
    this.emit(Events.Status, Status.Backdrop)
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

  async setDemoMode() {
    this.emit(Events.Status, Status.DemoMode)
    await this.page.waitForSelector(demoModeSelector)
    const demoMode = await this.getDemoMode()
    if (demoMode === this.config.demoMode) {
      console.log(`Demo mode is ${demoMode}.`)
    } else {
      await this.switchDemoMode()
    }
  }

  async switchDemoMode() {
    console.log(`Switching demo mode to ${this.config.demoMode}...`)
    await this.click(demoModeSelector)
    await this.click(switchDemoModeSelector)
    await this.click(confirmDemoModeSelector)
    await this.waitForMouse()
    const demoMode = await this.getDemoMode()
    if (demoMode !== this.config.demoMode) {
      throw new Error(`Failed switching demo mode to ${this.config.demoMode}!`)
    }
    console.log(`Demo mode switched to ${demoMode}.`)
  }

  async getDemoMode() {
    return await this.page.$eval(demoModeSelector, demoMode =>
      demoMode.textContent.startsWith('Virtual'),
    )
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

module.exports = Object.assign(EToro, { urlBase, viewport })
