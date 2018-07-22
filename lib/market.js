const Bot = require('./bot')

/** 'ui' or 'js' */
const discoveryMode = 'js'

const filterActiveInstruments = false

/** -1 to disable */
const maxAmountFilter = 50

/** 'percent' or 'amount' */
const spreadSortingMode = 'percent'

const marketsSelector = '.i-menu-link[href="/discover/markets"]'
const filterSelector = '[automation-id="discover-market-filter-button"]'
const itemSelector = '[automation-id="discover-popup-filter-item"]'
const industrySelector = `${itemSelector}:nth-child(2)`
const backSelector = '[automation-id="discover-popup-filter-back-button"]'
const nextSelector =
  '[automation-id="discover-market-next-button"]:not(.disabled)'

class Market extends Bot {
  async discover() {
    console.log(`Discovering market with ${discoveryMode}...`)
    this.sessionHandle = await this.page.evaluateHandle(
      () => angular.element('body').scope().session,
    )
    this.instrumentsHandle = await this.page.evaluateHandle(
      session => Object.values(session.instrumentsFactory.getAll()),
      this.sessionHandle,
    )
    switch (discoveryMode) {
      case 'js':
        await this.discoverWithJs()
        break
      case 'ui':
        await this.discoverWithUi()
        break
      default:
        throw new Error('Wrong discovery mode!')
    }
    await this.wait()
    console.log('Market discovered.')
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

  async discoverWithUi() {
    await this.click(marketsSelector)
    await this.click(filterSelector)
    const markets = await this.page.$$(itemSelector)
    await this.click(`${itemSelector}:nth-child(1)`)
    await this.discoverIndustry()
    await this.click(filterSelector)
    await this.click(backSelector)
    await this.click(`${itemSelector}:nth-child(2)`)
    await this.scanAllPages()
    for (let i = 3; i <= markets.length; i++) {
      await this.click(filterSelector)
      await this.click(`${itemSelector}:nth-child(${i})`)
      await this.scanAllPages()
    }
  }

  async discoverIndustry() {
    await this.click(industrySelector)
    const industries = await this.page.$$(itemSelector)
    await this.click(`${itemSelector}:nth-child(1)`)
    await this.scanAllPages()
    for (let i = 2; i <= industries.length; i++) {
      await this.click(filterSelector)
      await this.click(industrySelector)
      await this.click(`${itemSelector}:nth-child(${i})`)
      await this.scanAllPages()
    }
  }

  async scanAllPages() {
    await this.waitForMouse()
    while (await this.page.$(nextSelector)) {
      await this.click(nextSelector)
    }
  }

  async wait() {
    const instrumentsCount = await this.page.evaluate(
      instruments => instruments.length,
      this.instrumentsHandle,
    )
    let scannedCount = 0
    while (scannedCount < instrumentsCount) {
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
          .slice(0, 6),
      this.instrumentsHandle,
      filterActiveInstruments,
      maxAmountFilter,
      spreadSortingMode,
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
