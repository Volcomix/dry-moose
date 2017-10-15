const util = require('util')
const { execFile } = require('child_process')
const CDP = require('chrome-remote-interface')
const setTimeoutPromise = util.promisify(setTimeout)

const defaultOptions = {
  executablePath: 'google-chrome-stable',
  debuggingPort: 9222,
  maxRetry: 10,
  retryTimeout: 500,
}

class Chrome {
  constructor(options) {
    Object.assign(this, defaultOptions, options)
  }

  static async launch(options) {
    return new Chrome(options).launch()
  }

  async launch() {
    const chrome = this.exec()
    try {
      const client = await this.getClient()
      console.log('Client connected.')
      return client
    } catch (error) {
      if (chrome) {
        console.log('Killing Chrome...')
        chrome.kill()
      }
      throw error
    }
  }

  exec() {
    console.log('Starting Chrome...')
    return execFile(this.executablePath, [
      `--remote-debugging-port=${this.debuggingPort}`,
    ]).on('close', code => {
      console.log(`Chrome exited.`);
    });
  }

  async getClient(retry = 0) {
    try {
      console.log(`Trying to connect client... (${retry}/${this.maxRetry})`)
      return await CDP({ port: this.debuggingPort })
    } catch (error) {
      if (retry === this.maxRetry) {
        throw new Error('Client connection failed!')
      }
      await setTimeoutPromise(this.retryTimeout)
      return this.getClient(retry + 1)
    }
  }
}

module.exports = Chrome