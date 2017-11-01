const EventEmitter = require('events')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const mouseSpeed = 500

const marketSelector = '.table-body.market'
const rowSelector = `${marketSelector} .table-row`
const nameSelector = '.table-name-cell .user-info .user-nickname'
const cellSelector = '.table-info .table-cell'
const gainSelector = `${cellSelector} .gain-num`
const priceSelector = '.etoro-trade-button .etoro-price-value span'
const insightSelector = `${cellSelector} .watch-table-insight .watch-table-insight-data .table-insight-data-value`
const dataSelectors = {
  name: nameSelector,
  growth: `${gainSelector} .gain-num-protsent`,
  percentage: `${gainSelector} .gain-num-amount`,
  bid: `${cellSelector} .etoro-sell-button ${priceSelector}`,
  ask: `${cellSelector} .etoro-buy-button ${priceSelector}`,
  insightValue: `${insightSelector} .insight-data-value`,
  insightTitle: `${insightSelector} .table-insight-data-title`,
}
const menuSelector = '.options.dropdown-menu'
const editModeSelector = '.drop-select-box-option.edit'
const editRowSelector = '.edit'
const removeSelector = '.card-head-remove'
const doneSelector = '.inner-header-buttons.edit.edit-head .done[ng-show="editMode"]'
const searchSelector = '.a-head-toolbox .w-search-ph'
const clearSearchSelector = '.w-search-icon'
const searchInputSelector = '.w-search-input'
const searchResult = '.autocomplete-ph .w-search-results-ph .w-search-results .i-search-result'
const searchResultAddSelector = '.i-search-result-button-ph .i-search-result-button.add'

class Bot extends EventEmitter {
  constructor(page) {
    super()
    this.page = page
  }

  async listen(instrumentPicker) {
    instrumentPicker.once('pick', this.updateFavorites.bind(this))
    await this.page.exposeFunction(
      'drymoose_bot_receive', this.receive.bind(this)
    )
  }

  async updateFavorites({ privateInstruments, displayDatas }, bestInstruments) {
    this.privateInstruments = privateInstruments
    this.updateNamesToIds(displayDatas)
    await this.page.waitForSelector(marketSelector)
    let favorites = await this.retrievefavorites()
    const obsoletes = this.obsoletes(displayDatas, bestInstruments, favorites)
    const missings = this.missings(displayDatas, bestInstruments, favorites)
    await this.removeFavorites(obsoletes)
    await this.addFavorites(missings)
    favorites = await this.retrievefavorites()
    this.checkFavorites(bestInstruments, favorites)
    await this.watch()
  }

  updateNamesToIds(displayDatas) {
    this.namesToIds = Object.values(displayDatas).reduce(
      (namesToIds, displayData) => {
        namesToIds[displayData.symbolFull] = displayData.instrumentId
        return namesToIds
      }, {}
    )
  }

  async retrievefavorites() {
    const names = await this.page.$$eval(`${rowSelector} ${nameSelector}`,
      spans => spans.map(span => span.textContent)
    )
    return names.map(name => this.namesToIds[name])
  }

  obsoletes(displayDatas, bestInstruments, favorites) {
    const ids = new Set(bestInstruments)
    return favorites
      .filter(id => !ids.has(id))
      .map(id => displayDatas[id])
  }

  missings(displayDatas, bestInstruments, favorites) {
    const ids = new Set(favorites)
    return bestInstruments
      .filter(id => !ids.has(id))
      .map(id => displayDatas[id])
  }

  async removeFavorites(favorites) {
    if (!favorites.length) {
      return
    }
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(menuSelector)
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(editModeSelector)
    for (let favorite of favorites) {
      await this.removeFavorite(favorite)
    }
    await setTimeoutPromise(mouseSpeed)
    try {
      await this.page.click(doneSelector)
    } catch (error) {
      // All favorites are removed, done button disappeared
    }
  }

  async removeFavorite(favorite) {
    const rowsHandles = await this.page.$$(`${rowSelector}${editRowSelector}`)
    for (let rowHandle of rowsHandles) {
      const name = await this.retrieveName(rowHandle)
      if (name === favorite.symbolFull) {
        const closeButton = await this.retrieveCloseButton(rowHandle)
        await setTimeoutPromise(mouseSpeed)
        await closeButton.click()
        await closeButton.dispose()
      }
      await rowHandle.dispose()
    }
  }

  retrieveName(rowHandle) {
    return this.page.evaluate(
      (row, nameSelector) => (row.querySelector(nameSelector).textContent),
      rowHandle,
      nameSelector,
    )
  }

  retrieveCloseButton(rowHandle) {
    return this.page.evaluateHandle(
      (row, removeSelector) => row.querySelector(removeSelector),
      rowHandle,
      removeSelector,
    )
  }

  async addFavorites(favorites) {
    if (!favorites.length) {
      return
    }
    for (let favorite of favorites) {
      await this.addFavorite(favorite)
    }
  }

  async addFavorite(favorite) {
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(`${searchSelector} ${clearSearchSelector}`)
    await setTimeoutPromise(mouseSpeed)
    await this.page.type(
      `${searchSelector} ${searchInputSelector}`,
      favorite.symbolFull,
      { delay: 100 },
    )
    const addButtonSelector = `${searchSelector} ${
      searchResult}[data-id="${favorite.instrumentId}"] ${
      searchResultAddSelector}`
    await this.page.waitForSelector(addButtonSelector)
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(addButtonSelector)
  }

  checkFavorites(bestInstruments, favorites) {
    if (bestInstruments.sort().join() !== favorites.sort().join()) {
      throw new Error('Failed updating favorites.' +
        ` Found ${favorites} after trying to set ${bestInstruments}!`
      )
    }
  }

  watch() {
    return this.page.evaluate((rowSelector, dataSelectors) => {
      const rows = document.querySelectorAll(rowSelector)
      rows.forEach(row => {
        const observer = new MutationObserver(() => {
          const data = Object.keys(dataSelectors).reduce(
            (data, key) => {
              data[key] = row.querySelector(dataSelectors[key]).textContent
              return data
            }, {}
          )
          window.drymoose_bot_receive(data)
        })
        observer.observe(row, { characterData: true, subtree: true })
      })
    }, rowSelector, dataSelectors)
  }

  receive(data) {
    const instrumentId = this.namesToIds[data.name]
    const growth = parseFloat(data.growth.replace(/^\((.*)\)$/, '$1'))
    const percentage = parseFloat(data.percentage.replace(/^(.*)%$/, '$1'))
    const bid = parseFloat(data.bid)
    const ask = parseFloat(data.ask)
    const insight = this.parseInsight(data)
    const bidAskSpread = this.geBidAskSpread(instrumentId, bid, ask)
    this.emit('data', {
      instrumentId, growth, percentage, bid, ask, ...insight, bidAskSpread
    })
  }

  parseInsight({ insightValue, insightTitle }) {
    insightValue = parseFloat(insightValue.replace(/^(.*)%$/, '$1'))
    switch (insightTitle) {
      case 'Vente':
        return { sell: insightValue, buy: 100 - insightValue }
      case 'Achat':
        return { sell: 100 - insightValue, buy: insightValue }
      default:
        throw new Error(`Wrong insight title: ${insightTitle}`)
    }
  }

  geBidAskSpread(instrumentId, bid, ask) {
    const { minPositionAmount } = this.privateInstruments[instrumentId]
    const percent = (ask - bid) / ask
    const amount = percent * minPositionAmount
    return { percent, amount }
  }
}

module.exports = Bot