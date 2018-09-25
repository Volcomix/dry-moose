const puppeteer = require('puppeteer')

const Router = require('./router')

/** Set undefined to run a bundled version of Chromium */
const executablePath = 'google-chrome-unstable'

const userDataDir = './user-data'

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

class Browser extends Router {
  constructor(io) {
    const config = {
      headless: false,
    }
    const routes = {
      [Events.Start]: () => this.start(),
      [Events.Stop]: () => this.stop(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(config, io, '/browser', routes, events)
  }

  async start() {
    if (this.browser) {
      await this.stop()
    }
    this.emit(Events.Status, Status.Starting)
    console.log('Starting browser...')
    this.browser = await puppeteer.launch({
      executablePath,
      userDataDir,
      headless: this.config.headless,
    })
    this.browser.on('disconnected', () => this.disconnected())
    this.emit(Events.Status, Status.Started)
    console.log('Browser started.')
  }

  async stop() {
    if (!this.browser) {
      console.warn('Browser is already stopped!')
      return
    }
    console.log('Stopping browser...')
    await this.browser.close()
  }

  disconnected() {
    this.browser = undefined
    this.emit(Events.Status, Status.Stopped)
    console.log('Browser stopped.')
  }
}

module.exports = Browser
