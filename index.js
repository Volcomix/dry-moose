const puppeteer = require('puppeteer')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const chromePath = 'google-chrome-unstable'
const demoMode = true

const urlBase = 'https://www.etoro.com'
const loginUrl = `${urlBase}/login`
const landingUrl = `${urlBase}/watchlists`

const mouseSpeed = 500

const backdropCloseSelector = '.inmplayer-popover-close-button'
const demoModeSelector = '.i-menu-link-mode-demo'
const switchDemoModeSelector = `${demoModeSelector} .drop-select-box-option:not(.checked)`
const confirmDemoModeSelector = '.uidialog .w-sm-footer-button'

class DryMoose {
  constructor() {
    this.page = undefined
  }

  async run() {
    await this.launch()
    await this.waitForLogin()
    await this.closeBackdrop()
    await this.setDemoMode()
  }

  async launch() {
    console.log('Launching Chrome...')
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      userDataDir: './user-data',
      appMode: true,
      args: ['--start-maximized', '--no-default-browser-check'],
    })
    const pages = await browser.pages()
    this.page = pages[0]
    console.log('Chrome launched.')
  }

  async waitForLogin() {
    console.log('Waiting for login...')
    await this.page.goto(loginUrl)
    while (this.page.url() !== landingUrl) {
      await this.page.waitForNavigation()
    }
    console.log('Logged in.')
  }

  async closeBackdrop() {
    await setTimeoutPromise(5000)
    const closeHandle = await this.page.$(backdropCloseSelector)
    if (closeHandle) {
      console.log('Closing backdrop...')
      await closeHandle.click()
      console.log('Backdrop closed.')
    } else {
      console.log('No backdrop.')
    }
  }

  async setDemoMode() {
    const demoModeHandle = await this.page.waitForSelector(demoModeSelector)
    const isDemoMode = await this.getDemoMode(demoModeHandle)
    if (isDemoMode === demoMode) {
      console.log(`Demo mode is ${isDemoMode}.`)
    } else {
      await this.switchDemoMode(demoModeHandle)
    }
  }

  async switchDemoMode(demoModeHandle) {
    console.log(`Switching demo mode to ${demoMode}...`)
    await setTimeoutPromise(mouseSpeed)
    await demoModeHandle.click()
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(switchDemoModeSelector)
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(confirmDemoModeSelector)
    await setTimeoutPromise(mouseSpeed)
    const isDemoMode = await this.getDemoMode(demoModeHandle)
    if (isDemoMode !== demoMode) {
      throw new Error('Failed switching demo mode!')
    }
    console.log(`Demo mode switched to ${isDemoMode}.`)
  }

  getDemoMode(demoModeHandle) {
    return this.page.evaluate(
      demoMode => demoMode.textContent.startsWith('Virtual'),
      demoModeHandle,
    )
  }
}

process.on('unhandledRejection', error => {
  throw error
})

new DryMoose().run()
