const puppeteer = require('puppeteer')

class Chrome {
  async launch(chromePath) {
    console.log('Launching Chrome...')
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      userDataDir: './user-data',
      appMode: true,
      args: ['--start-maximized', '--no-default-browser-check'],
    })
    const pages = await browser.pages()
    console.log('Chrome launched.')
    return pages[0]
  }
}

module.exports = Chrome
