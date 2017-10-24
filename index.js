const os = require('os')
const path = require('path')

const puppeteer = require('puppeteer')

const Sniffer = require('./sniffer')
const MongoLogger = require('./mongo-logger')
const ElasticLogger = require('./elastic-logger')

const chromeOptions = {
  executablePath: 'google-chrome-stable',
  userDataDir: path.join(os.homedir(), '.config/google-chrome'),
}

const url = 'https://www.etoro.com'

class DryMoose {
  async run() {
    try {
      const browser = await puppeteer.launch({ appMode: true, ...chromeOptions })

      const mongoLogger = new MongoLogger()
      await mongoLogger.connect()

      const elasticLogger = new ElasticLogger()

      const sniffer = new Sniffer()
      mongoLogger.listen(sniffer)
      elasticLogger.listen(sniffer)

      const page = await browser.newPage()
      sniffer.sniff(page)

      await mongoLogger.logOne('executions', { Event: 'start' })
      await elasticLogger.logOne('executions', { Event: 'start' })
      await page.goto(url)

    } catch (error) {
      console.error(error)
    }
  }
}

new DryMoose().run()