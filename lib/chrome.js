const puppeteer = require('puppeteer')

const { urlBase } = require('./etoro')

const viewport = { width: 1800, height: 800 }

class Chrome {
  async launch(chromePath) {
    console.log('Launching Chrome...')
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      userDataDir: './user-data',
      headless: false,
      args: ['--start-maximized'],
    })
    browser.on('targetcreated', this.setViewport)
    const pages = await browser.pages()
    const page = pages[0]
    await this.bypassAutomationCheck(page)
    await page.setViewport(viewport)
    console.log('Chrome launched.')
    return page
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

module.exports = Chrome
