const os = require('os')
const path = require('path')

const puppeteer = require('puppeteer')

const Sniffer = require('./sniffer')
const Logger = require('./logger')
const MongoLogger = require('./mongo-logger')
const ElasticLogger = require('./elastic-logger')
const InstrumentPicker = require('./instrument-picker')
const Bot = require('./bot')

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

new DryMoose().run()