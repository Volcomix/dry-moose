const Bot = require('./bot')

const demoModeSelector = '.i-menu-link-mode-demo'
const switchDemoModeSelector = `${demoModeSelector} .drop-select-box-option:not(.checked)`
const confirmDemoModeSelector = '.uidialog .w-sm-footer-button'

class DemoMode extends Bot {
  async set(demoMode) {
    await this.page.waitForSelector(demoModeSelector)
    const isDemoMode = await this.get()
    if (isDemoMode === demoMode) {
      console.log(`Demo mode is ${isDemoMode}.`)
    } else {
      await this.switch(demoMode)
    }
  }

  async switch(demoMode) {
    console.log(`Switching demo mode to ${demoMode}...`)
    await this.click(demoModeSelector)
    await this.click(switchDemoModeSelector)
    await this.click(confirmDemoModeSelector)
    await this.waitForMouse()
    const isDemoMode = await this.get()
    if (isDemoMode !== demoMode) {
      throw new Error('Failed switching demo mode!')
    }
    console.log(`Demo mode switched to ${isDemoMode}.`)
  }

  async get() {
    return this.page.$eval(demoModeSelector, demoMode =>
      demoMode.textContent.startsWith('Virtual'),
    )
  }
}

module.exports = DemoMode
