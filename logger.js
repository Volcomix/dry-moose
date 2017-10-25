class Logger {
  constructor(...loggersClasses) {
    this.loggers = loggersClasses.map(loggerClass => new loggerClass())
  }

  connect() {
    return Promise.all(
      this.loggers.map(logger => {
        if (logger.connect) {
          return logger.connect()
        }
      })
    )
  }

  listen(sniffer) {
    sniffer.on('data', this.logMany.bind(this))
  }

  logOne(name, data) {
    return Promise.all(
      this.loggers.map(logger => logger.logOne(name, data))
    )
  }

  logMany(name, data) {
    return Promise.all(
      this.loggers.map(logger => logger.logMany(name, data))
    )
  }
}

module.exports = Logger