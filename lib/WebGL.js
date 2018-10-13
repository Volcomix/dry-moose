const Bot = require('./Bot')

const tfjsUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs'

const learningPageContent = `
<html>
  <head><title>WebGL</title></head>
  <body>WebGL</body>
</html>
`

const Events = {
  Start: 'Start',
  Stop: 'Stop',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Starting: 'Starting',
  Started: 'Started',
}

class WebGL extends Bot {
  constructor(browser, io) {
    const routes = {
      [Events.Start]: () => this.start(),
      [Events.Stop]: () => this.stop(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/webgl', routes, events)
    this.browser = browser
  }

  async start() {
    if (!this.browser.browser) {
      console.warn('Browser is stopped, WebGL could not be started!')
      return
    }
    if (this.page) {
      await this.stop()
    }
    this.emit(Events.Status, Status.Starting)
    console.log('Starting WebGL...')
    this.page = await this.browser.browser.newPage()
    this.page.on('close', () => this.closed())
    await page.setContent(learningPageContent)
    await page.addScriptTag({ url: tfjsUrl })
    this.emit(Events.Status, Status.Started)
    console.log('WebGL started.')
  }

  async stop() {
    if (!this.page) {
      console.warn('WebGL is alread stopped!')
      return
    }
    console.log('Stopping WebGL...')
    await this.page.close()
  }

  closed() {
    this.page = undefined
    this.emit(Events.Status, Status.Stopped)
    console.log('WebGL stopped.')
  }
}

module.exports = WebGL
