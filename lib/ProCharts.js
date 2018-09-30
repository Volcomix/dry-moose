const Bot = require('./Bot')
const { urlBase, viewport } = require('./EToro')

const url = `${urlBase}/app/procharts?instruments=`

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

class ProCharts extends Bot {
  constructor(browser, eToro, io) {
    const routes = {
      [Events.Start]: () => this.start(),
      [Events.Stop]: () => this.stop(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(io, '/procharts', routes, events)
    this.browser = browser
    this.eToro = eToro
  }

  async start() {
    if (!this.eToro.page) {
      console.warn('eToro is stopped, ProCharts could not be started!')
      return
    }
    if (this.page) {
      await this.stop()
    }
    this.emit(Events.Status, Status.Starting)
    console.log('Starting ProCharts...')
    this.page = await this.browser.browser.newPage()
    this.page.on('close', () => this.closed())
    await this.page.setViewport(viewport)
    await this.page.goto(url)
    this.emit(Events.Status, Status.Started)
    console.log('ProCharts started.')
  }

  async stop() {
    if (!this.page) {
      console.warn('ProCharts is alread stopped!')
      return
    }
    console.log('Stopping ProCharts...')
    await this.page.close()
  }

  closed() {
    this.page = undefined
    this.emit(Events.Status, Status.Stopped)
    console.log('ProCharts stopped.')
  }
}

module.exports = ProCharts
