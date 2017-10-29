const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const mouseSpeed = 500

const rowSelector = '.table-body.market .table-row'
const nameSelector = '.table-name-cell .user-info .user-nickname'
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

class Bot {
  constructor(page) {
    this.page = page
  }

  listen(instrumentPicker) {
    instrumentPicker.on('pick', this.updateFavorites.bind(this))
  }

  async updateFavorites(displayDatas, bestInstruments) {
    const namesToIds = this.namesToIds(displayDatas)
    let favorites = await this.retrievefavorites(namesToIds)
    const obsoletes = this.obsoletes(displayDatas, bestInstruments, favorites)
    const missings = this.missings(displayDatas, bestInstruments, favorites)
    await this.removeFavorites(obsoletes)
    await this.addFavorites(missings)
    favorites = await this.retrievefavorites(namesToIds)
    this.checkFavorites(bestInstruments, favorites)
  }

  namesToIds(displayDatas) {
    return Object.values(displayDatas).reduce(
      (namesToIds, displayData) => {
        namesToIds[displayData.symbolFull] = displayData.instrumentId
        return namesToIds
      }, {}
    )
  }

  async retrievefavorites(namesToIds) {
    const names = await this.page.$$eval(`${rowSelector} ${nameSelector}`,
      spans => spans.map(span => span.textContent)
    )
    return names.map(name => namesToIds[name])
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
}

module.exports = Bot