const Bot = require('./bot')

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const filterSelector = '[automation-id="discover-market-filter-button"]'
const itemSelector = '[automation-id="discover-popup-filter-item"]'
const industrySelector = `${itemSelector}:nth-child(2)`
const backSelector = '[automation-id="discover-popup-filter-back-button"]'
const closeSelector = '[automation-id="discover-popup-filter-close-button"]'
const nextSelector =
  '[automation-id="discover-market-next-button"]:not(.disabled)'

const Events = {
  Discover: 'Discover',
  Cancel: 'Cancel',
  Status: 'Status',
}

const Status = {
  Stopped: 'Stopped',
  Discovering: 'Discovering',
  Discovered: 'Discovered',
  Cancelling: 'Cancelling',
  Cancelled: 'Cancelled',
}

class Market extends Bot {
  constructor(eToro, io) {
    const config = {
      /** 'ui' or 'js' */
      discoveryMode: 'js',

      filterActiveInstruments: false,

      /** -1 to disable */
      maxAmountFilter: 50,

      /** 'percent' or 'amount' */
      spreadSortingMode: 'percent',

      instrumentsCount: 6,
    }
    const routes = {
      [Events.Discover]: () => this.discover(),
      [Events.Cancel]: () => this.cancel(),
    }
    const events = {
      [Events.Status]: [Status.Stopped],
    }
    super(config, io, '/market', routes, events)
    this.eToro = eToro
  }

  async discover() {
    if (!this.eToro.page) {
      console.warn('eToro is stopped, market could not be discovered!')
      return
    }
    this.emit(Events.Status, Status.Discovering)
    console.log(`Discovering market with ${this.config.discoveryMode}...`)
    this.isCancelled = false
    this.page = this.eToro.page
    this.sessionHandle = await this.page.evaluateHandle(
      () => angular.element('body').scope().session,
    )
    this.instrumentsHandle = await this.page.evaluateHandle(
      session => Object.values(session.instrumentsFactory.getAll()),
      this.sessionHandle,
    )
    switch (this.config.discoveryMode) {
      case 'js':
        await this.discoverWithJs()
        break
      case 'ui':
        await this.discoverWithUI()
        break
      default:
        throw new Error('Wrong discovery mode!')
    }
    await this.wait()
    if (this.isCancelled) {
      this.emit(Events.Status, Status.Cancelled)
      console.log('Market discovery cancelled.')
    } else {
      this.emit(Events.Status, Status.Discovered)
      console.log('Market discovered.')
    }
  }

  async cancel() {
    this.isCancelled = true
    this.emit(Events.Status, Status.Cancelling)
    console.log('Cancelling market discovery...')
  }

  async discoverWithJs() {
    await this.page.evaluate(
      (session, instruments) => {
        instruments.forEach(({ InstrumentID }) => {
          session.instrumentsFactory.getById(InstrumentID)
        })
      },
      this.sessionHandle,
      this.instrumentsHandle,
    )
  }

  async discoverWithUI() {
    await this.click(marketsSelector)
    await this.click(filterSelector)
    const markets = await this.page.$$eval(itemSelector, items =>
      items.map(item => item.textContent.trim()),
    )
    for (let i = 0; i < markets.length && !this.isCancelled; i++) {
      await this.click(`${itemSelector}:nth-child(${i + 1})`)
      switch (markets[i]) {
        case 'Crypto':
          await this.discoverCrypto()
          break
        case 'Stocks':
          await this.discoverIndustry()
          break
        default:
          await this.discoverMarket()
      }
    }
    await this.click(closeSelector)
  }

  async discoverMarket() {
    await this.scanAllPages()
    await this.click(filterSelector)
  }

  async discoverCrypto() {
    const types = await this.page.$$(itemSelector)
    for (let i = 1; i <= types.length && !this.isCancelled; i++) {
      await this.click(`${itemSelector}:nth-child(${i})`)
      await this.scanAllPages()
      await this.click(filterSelector)
    }
    await this.click(backSelector)
  }

  async discoverIndustry() {
    await this.click(industrySelector)
    const industries = await this.page.$$(itemSelector)
    for (let i = 1; i <= industries.length && !this.isCancelled; i++) {
      await this.click(`${itemSelector}:nth-child(${i})`)
      await this.scanAllPages()
      await this.click(filterSelector)
      await this.click(industrySelector)
    }
    await this.click(backSelector)
    await this.click(backSelector)
  }

  async scanAllPages() {
    await this.waitForMouse()
    while ((await this.page.$(nextSelector)) && !this.isCancelled) {
      await this.click(nextSelector)
    }
  }

  async wait() {
    const instrumentsCount = await this.page.evaluate(
      instruments => instruments.length,
      this.instrumentsHandle,
    )
    let scannedCount = 0
    while (scannedCount < instrumentsCount && !this.isCancelled) {
      await this.sleep(500)
      scannedCount = await this.page.evaluate(
        (session, instruments) =>
          instruments.filter(({ InstrumentID }) =>
            session.instrumentsFactory.getTradingSettingByInstrumentId(
              InstrumentID,
              'InstrumentID',
            ),
          ).length,
        this.sessionHandle,
        this.instrumentsHandle,
      )
    }
  }

  async filter() {
    const spreads = await this.page.evaluate(
      (
        instruments,
        filterActiveInstruments,
        maxAmountFilter,
        spreadSortingMode,
      ) =>
        instruments
          .filter(
            instrument =>
              !filterActiveInstruments ||
              (instrument.IsActive &&
                instrument.rate.ClosingPrices.IsMarketOpen),
          )
          .filter(
            instrument =>
              maxAmountFilter === -1 ||
              Math.max(
                instrument.MinPositionAmount /
                  Math.max(...instrument.Leverages),
                instrument.MinPositionAmountAbsolute,
              ) <= maxAmountFilter,
          )
          .map(instrument => {
            switch (spreadSortingMode) {
              case 'percent':
                return [
                  instrument.Name,
                  (instrument.rate.Ask - instrument.rate.Bid) /
                    instrument.rate.Ask,
                ]
              case 'amount':
                return [
                  instrument.Name,
                  instrument.MinPositionAmount *
                    ((instrument.rate.Ask - instrument.rate.Bid) /
                      instrument.rate.Ask),
                ]
              default:
                throw new Error('Wrong spread sorting mode!')
            }
          })
          .sort(([, aSpread], [, bSpread]) => aSpread - bSpread)
          .slice(0, this.config.instrumentsCount),
      this.instrumentsHandle,
      this.config.filterActiveInstruments,
      this.config.maxAmountFilter,
      this.config.spreadSortingMode,
    )
    console.log(
      `Spreads: ${spreads
        .map(([name, spread]) => `${name} (${spread})`)
        .join(', ')}`,
    )
    return spreads.map(([name]) => name)
  }
}

module.exports = Market
