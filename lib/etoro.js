// Must be defined before requiring ./login
exports.urlBase = 'https://www.etoro.com'

const Router = require('./router')
const Login = require('./login')
const DemoMode = require('./demo-mode')

class EToro extends Router {
  constructor(browser, io) {
    super(
      io,
      '/eToro',
      {
        start: () => this.start(),
      },
      {
        status: ['stopped'],
      },
    )
    this.browser = browser
  }

  async start() {
    if (!this.browser.isStarted) {
      return console.warn('Browser is stopped, eToro could not be started!')
    }
    console.log('Starting eToro...')
    const login = new Login(this.browser.page)
    this.emit('status', 'login')
    await login.wait()
    this.emit('status', 'backdrop')
    await login.closeBackdrop()
    this.emit('status', 'demoMode')
    await new DemoMode(this.browser.page).set()
    this.emit('status', 'started')
    console.log('eToro started.')
  }
}

EToro.urlBase = exports.urlBase

module.exports = EToro
