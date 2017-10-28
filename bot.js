const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)

const mouseSpeed = 500

class Bot {
  constructor(page) {
    this.page = page
  }

  listen(instrumentPicker) {
    instrumentPicker.on('pick', this.updateFavorites.bind(this))
  }

  async updateFavorites(names) {
    console.log(names)

    const rowSelector = '.table-body.market .table-row'
    const nameSelector = '.table-name-cell .user-info .user-nickname'
    const favorites = new Set(await this.page.$$eval(
      `${rowSelector} ${nameSelector}`,
      spans => spans.map(span => span.textContent)
    ))
    console.log(favorites)

    const obsoletes = [...favorites].filter(
      favorite => !names.has(favorite)
    )
    console.log(obsoletes)
    if (obsoletes.length) {
      await setTimeoutPromise(mouseSpeed)
      await this.page.click('.options.dropdown-menu')
      await setTimeoutPromise(mouseSpeed)
      await this.page.click('.drop-select-box-option.edit')
      for (let obsolete of obsoletes) {
        const rowsHandles = await this.page.$$(`${rowSelector}.edit`)
        for (let rowHandle of rowsHandles) {
          const name = await this.page.evaluate(
            (row, nameSelector) => (
              row.querySelector(nameSelector).textContent
            ),
            rowHandle,
            nameSelector,
          )
          if (name === obsolete) {
            const closeButton = await this.page.evaluateHandle(
              row => row.querySelector('.card-head-remove'),
              rowHandle,
            )
            await setTimeoutPromise(mouseSpeed)
            await closeButton.click()
            await closeButton.dispose()
          }
          await rowHandle.dispose()
        }
      }
      await setTimeoutPromise(mouseSpeed)
      await this.page.click(
        '.inner-header-buttons.edit.edit-head .done[ng-show="editMode"]'
      )
    }

    const missings = [...names].filter(
      name => !favorites.has(name)
    )
    console.log(missings)
    if (missings.length) {
      for (let missing of missings) {
        await setTimeoutPromise(mouseSpeed)
        await this.page.click(
          '.a-head-toolbox .w-search-ph .w-search-icon.sprite'
        )
        await setTimeoutPromise(mouseSpeed)
        await this.page.type(
          '.a-head-toolbox .w-search-ph .w-search-input',
          missing,
          { delay: 100 },
        )
        await setTimeoutPromise(mouseSpeed)
        await this.page.click(
          '.a-head-toolbox .w-search-ph .autocomplete-ph'
          + ' .w-search-results-ph .w-search-results'
          + ' .i-search-result .i-search-result-button-ph'
        )
      }
    }
  }
}

module.exports = Bot