const Chrome = require('./lib/chrome')
const Login = require('./lib/login')
const DemoMode = require('./lib/demo-mode')
const Market = require('./lib/market')

const chromePath = 'google-chrome-unstable'
const demoMode = true

class DryMoose {
  async run() {
    const page = await new Chrome().launch(chromePath)
    await new Login(page).wait()
    await new DemoMode(page).set(demoMode)
    await new Market(page).discover()
  }
}

process.on('unhandledRejection', error => {
  throw error
})

new DryMoose().run()
