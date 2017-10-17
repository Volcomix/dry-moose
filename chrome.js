const util = require('util')
const { execFile } = require('child_process')
const CDP = require('chrome-remote-interface')
const setTimeoutPromise = util.promisify(setTimeout)

class Chrome {
  constructor(options) {
    this.executablePath = 'google-chrome-stable'
    this.debuggingPort = 9222
    this.maxRetry = 10
    this.retryTimeout = 500

    Object.assign(this, options)
  }

  async launch() {
    this.process = this.exec()
    this.client = await this.getClient()
    console.log('Client connected.')
  }

  async close() {
    if (this.client) {
      console.log('Closing client...')
      await this.client.close()
      console.log('Client closed.')
    }
    if (this.process) {
      console.log('Killing Chrome...')
      this.process.kill()
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