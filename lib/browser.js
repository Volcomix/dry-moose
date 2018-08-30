const puppeteer = require('puppeteer')

const Router = require('./router')

const headless = false

/** Set undefined to run a bundled version of Chromium */
const executablePath = 'google-chrome-unstable'

const userDataDir = './user-data'

const Status = {
  Stopping: 'Stopping',
  Stopped: 'Stopped',
  Starting: 'Starting',
  Started: 'Started',
}

const Events = {
  Status: 'Status',
}

class Browser extends Router {
  constructor(io) {
    const routes = {
      start: () => this.start(),
      stop: () => this.stop(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/browser', routes, events)
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
      headless,
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
    this.emit(Events.Status, Status.Stopping)
    console.log('Stopping browser...')
    await this.browser.close()
    console.log('Browser stopped.')
  }

  disconnected() {
    this.browser = undefined
    this.emit(Events.Status, Status.Stopped)
    console.log('Browser disconnected.')
  }
}

module.exports = Browser
