const Chrome = require('./chrome')
const Market = require('./market')

async function main() {
  const chrome = new Chrome()
  try {
    await chrome.launch()
    const market = await Market.watch(chrome.client)
    return

    const { Page, Runtime } = client

    await Page.enable()
    await Page.navigate({ url: 'https://www.etoro.com' })

    await Page.loadEventFired()
    const mode = await Runtime.evaluate({
      expression: `(${() => {
        return new Promise((resolve, reject) => {
          const observer = new MutationObserver((mutations, observer) => {
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                  return
                }
                const mode = node.querySelector('.i-menu-link-mode-demo')
                if (mode) {
                  observer.disconnect()
                  resolve(mode.innerText.trim())
                }
              })
            })
          })

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          })
        })
      }})()`,
      awaitPromise: true,
    })
    console.log(`Mode: ${mode.result.value}`)
  } catch (error) {
    console.error(error)
    chrome.close()
  }
}

main()