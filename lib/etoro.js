const Bot = require('./bot')

const demoMode = true

const urlBase = 'https://www.etoro.com'
const url = `${urlBase}/watchlists`
const viewport = { width: 1800, height: 800 }
const backdropCloseDelay = 1000
const backdropCloseSelector = '.inmplayer-popover-close-button'
const demoModeSelector = '.i-menu-link-mode-demo'
const switchDemoModeSelector = `${demoModeSelector} .drop-select-box-option:not(.checked)`
const confirmDemoModeSelector = '.uidialog .w-sm-footer-button'

class EToro extends Bot {
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
    await this.open()
    await this.waitForLogin()
    await this.closeBackdrop()
    await this.setDemoMode()
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
    this.emit('status', 'open')
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
    this.emit('status', 'stopped')
    console.log('eToro page closed.')
  }

  async waitForLogin() {
    this.emit('status', 'login')
    console.log('Waiting for login...')
    await this.page.goto(url)
    while (this.page.url() !== url) {
      await this.page.waitForNavigation()
    }
    console.log('Logged in.')
  }

  async closeBackdrop() {
    this.emit('status', 'backdrop')
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
    this.emit('status', 'demoMode')
    await this.page.waitForSelector(demoModeSelector)
    const isDemoMode = await this.getDemoMode()
    if (isDemoMode === demoMode) {
      console.log(`Demo mode is ${isDemoMode}.`)
    } else {
      await this.switchDemoMode()
    }
  }

  async switchDemoMode() {
    console.log(`Switching demo mode to ${demoMode}...`)
    await this.click(demoModeSelector)
    await this.click(switchDemoModeSelector)
    await this.click(confirmDemoModeSelector)
    await this.waitForMouse()
    const isDemoMode = await this.getDemoMode()
    if (isDemoMode !== demoMode) {
      throw new Error('Failed switching demo mode!')
    }
    console.log(`Demo mode switched to ${isDemoMode}.`)
  }

  async getDemoMode() {
    return this.page.$eval(demoModeSelector, demoMode =>
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

module.exports = EToro
