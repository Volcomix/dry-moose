const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const mouseSpeed = 500

const demoModeSelector = '.i-menu-link-mode-demo'
const switchDemoModeSelector = `${demoModeSelector} .drop-select-box-option:not(.checked)`
const confirmDemoModeSelector = '.uidialog .w-sm-footer-button'

class DemoMode {
  constructor(page) {
    this.page = page
  }

  async set(demoMode) {
    const demoModeHandle = await this.page.waitForSelector(demoModeSelector)
    const isDemoMode = await this.get(demoModeHandle)
    if (isDemoMode === demoMode) {
      console.log(`Demo mode is ${isDemoMode}.`)
    } else {
      await this.switch(demoMode, demoModeHandle)
    }
  }

  async switch(demoMode, demoModeHandle) {
    console.log(`Switching demo mode to ${demoMode}...`)
    await setTimeoutPromise(mouseSpeed)
    await demoModeHandle.click()
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(switchDemoModeSelector)
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(confirmDemoModeSelector)
    await setTimeoutPromise(mouseSpeed)
    const isDemoMode = await this.get(demoModeHandle)
    if (isDemoMode !== demoMode) {
      throw new Error('Failed switching demo mode!')
    }
    console.log(`Demo mode switched to ${isDemoMode}.`)
  }

  get(demoModeHandle) {
    return this.page.evaluate(
      demoMode => demoMode.textContent.startsWith('Virtual'),
      demoModeHandle,
    )
  }
}

module.exports = DemoMode
