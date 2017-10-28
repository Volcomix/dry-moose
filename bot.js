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
const clearSearchSelector = '.w-search-icon.sprite'
const searchInputSelector = '.w-search-input'
const searchResultAddSelector = '.autocomplete-ph .w-search-results-ph .w-search-results .i-search-result .i-search-result-button-ph'

class Bot {
  constructor(page) {
    this.page = page
  }

  listen(instrumentPicker) {
    instrumentPicker.on('pick', this.updateFavorites.bind(this))
  }

  async updateFavorites(names) {
    const favorites = await this.retrievefavorites()
    const obsoletes = [...favorites].filter(favorite => !names.has(favorite))
    await this.removeFavorites(obsoletes)
    const missings = [...names].filter(name => !favorites.has(name))
    await this.addFavorites(missings)
  }

  async retrievefavorites() {
    return new Set(await this.page.$$eval(`${rowSelector} ${nameSelector}`,
      spans => spans.map(span => span.textContent)
    ))
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
    await this.page.click(doneSelector)
  }

  async removeFavorite(favorite) {
    const rowsHandles = await this.page.$$(`${rowSelector}${editRowSelector}`)
    for (let rowHandle of rowsHandles) {
      const name = await this.retrieveName(rowHandle)
      if (name === favorite) {
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
      `${searchSelector} ${searchInputSelector}`, favorite, { delay: 100 }
    )
    await setTimeoutPromise(mouseSpeed)
    await this.page.click(`${searchSelector} ${searchResultAddSelector}`)
  }
}

module.exports = Bot