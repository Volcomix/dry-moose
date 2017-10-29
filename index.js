const os = require('os')
const path = require('path')

const puppeteer = require('puppeteer')

const Sniffer = require('./lib/sniffer')
const Logger = require('./lib/logger')
const MongoLogger = require('./lib/mongo-logger')
const ElasticLogger = require('./lib/elastic-logger')
const InstrumentPicker = require('./lib/instrument-picker')
const Bot = require('./lib/bot')

const chromeOptions = {
  executablePath: 'google-chrome-unstable',
  userDataDir: path.join(os.homedir(), '.config/google-chrome'),
}

const url = 'https://www.etoro.com/watchlists'

class DryMoose {
  async run() {
    try {
      const browser = await puppeteer.launch({ appMode: true, ...chromeOptions })
      const page = await browser.newPage()

      const sniffer = new Sniffer()
      sniffer.sniff(page)

      const logger = new Logger(MongoLogger, ElasticLogger)
      await logger.connect()
      logger.listen(sniffer)

      const instrumentPicker = new InstrumentPicker(logger)
      instrumentPicker.listen(sniffer)

      const bot = new Bot(page)
      bot.listen(instrumentPicker)

      await logger.logOne('executions', { event: 'start' })
      await page.goto(url)

    } catch (error) {
      console.error(error)
    }
  }
}

process.on('unhandledRejection', error => { throw error })

new DryMoose().run()