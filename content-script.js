class YouTubeHelpers {
    /**
     * Returns an element from the DOM
     * @param {string} selector
     * @returns {Element}
     */
    static findNode(selector) {
        var node = document.querySelector(selector)

        if (!node) {
            throw 'Could not find ' + selector
        }

        console.debug('Found ' + selector)

        return node
    }
    /**
     * Async version of setInterval
     * @param {Function} func
     * @param {Number} delay
     * @param {Number} tries
     * @returns {Promise<any>}
     */
    static setIntervalAsync(func, delay, tries) {
        return new Promise((resolve, reject) => {
            let intervalCount = 0
            const interval = setInterval(() => {
                console.debug(`Trial: ${intervalCount}`)
                if (intervalCount++ >= tries) {
                    console.debug(
                        `intervalCount++ >= tries: ${intervalCount++ >= tries}`
                    )
                    clearInterval(interval)
                    return reject()
                }

                try {
                    console.debug(`Running func`)
                    const result = func()
                    console.debug(`Done Running func`, result)

                    if (result) {
                        clearInterval(interval)
                        return resolve(result)
                    }
                } catch (e) {
                    reject(e)
                }
            }, delay)
        })
    }
    /**
     * Async version of setTimeout
     * @param {Function} func
     * @param {Number} delay
     * @returns {Promise<any>}
     */
    static setTimeoutAsync(func, delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const result = func()
                    return resolve(result)
                } catch (e) {
                    return reject(e)
                }
            }, delay)
        })
    }
    /**
     * Combines setTimeout() and setInterval()
     * @param {Function} func
     * @param {Number} timeout (ms)
     * @param {Number} interval (ms)
     * @param {Number} tries Max number of tries
     * @returns {Promise<any>}
     */
    static async setTimeoutIntervalAsync(func, timeout, interval, tries) {
        return await YouTubeHelpers.setTimeoutAsync(async () => {
            return await YouTubeHelpers.setIntervalAsync(func, interval, tries)
        }, timeout)
    }
    /**
     * Finds all the nodes based on a selector
     * @param {String} selector
     * @returns {Promise<NodeListOf<Element>>}
     * @param {number} delay
     * @param {number} tries
     */
    static async findNodes(selector, delay, tries) {
        const func = () => {
            var node = document.querySelectorAll(selector)

            if (!node) {
                throw 'Could not find ' + selector
            }

            if (node.length == 0) {
                return
            }

            console.debug('Found ' + selector)

            return node
        }

        return await YouTubeHelpers.setIntervalAsync(func, delay, tries)
    }

    /**
     * Finds all children for a parent node
     * @param {Element} parentNode Node to select children from
     * @param {String} childSelector Child selector
     * @returns {NodeListOf<Element>}
     */
    static findChildNodes(parentNode, childSelector) {
        var childNodes = parentNode.querySelectorAll(childSelector)

        if (!childNodes || childNodes.length == 0) {
            throw 'Could not find ' + childSelector
        }
        console.debug('Found children' + childSelector)

        return childNodes
    }

    static clearNodeChildren(node) {
        node.innerHTML = ''
    }
    // TODO: Add doc
    static updateParentChildren = (parentNode, childNodes) => {
        // Clear the current DIV HTML
        YouTubeHelpers.clearNodeChildren(parentNode)

        // Add the sorted array back in
        childNodes.forEach((p) => parentNode.appendChild(p))
        console.debug('Done replacing children!')
    }
}

/**
 * Finds a parent element, then its children.
 * It sorts its children, clears the parent's children, re-adds
 * sorted children back to parent.
 * @param {String} parentSelector
 * @param {String} childSelector
 */
const sortAndUpdateParentChildren = function (parentSelector, childSelector) {
    const parentNode = YouTubeHelpers.findNode(parentSelector)
    const childNodes = YouTubeHelpers.findChildNodes(parentNode, childSelector)

    console.debug('sorting children')
    const childNodesArray = [].slice.call(childNodes, 0)
    const sortedChildNodesArray = childNodesArray.sort((a, b) =>
        a.innerText === b.innerText ? 0 : a.innerText > b.innerText ? 1 : -1
    )
    YouTubeHelpers.updateParentChildren(parentNode, sortedChildNodesArray)
}

/**
 * Finds the playlist box and adds a search box to it
 * @param {String} playlistDivSelector
 * @param {String} playlistsSelector
 */
const addSearchField = function (playlistDivSelector, playlistsSelector) {
    // Find playlist DIV
    const playlistsNode = YouTubeHelpers.findNode(playlistDivSelector)
    // Find all the children
    const childNodes = YouTubeHelpers.findChildNodes(
        playlistsNode,
        playlistsSelector
    )
    // Copy the children un-mutated to another array
    /** @type {any[]} */
    const originalChildNodes = [].slice.call(childNodes, 0)

    // Create the search box and attach to top of playlist

    // Style the search box

    const searchBar = createSearchBar()

    // Create keyup event to trigger search
    const search = (event) => {
        event.preventDefault()
        const currentValue = event.target.value
        const filteredList = originalChildNodes.filter((p) =>
            p.innerText
                .trim()
                .toLowerCase()
                .includes(currentValue.trim().toLowerCase())
        )
        YouTubeHelpers.updateParentChildren(playlistsNode, filteredList)
    }

    searchBar.addEventListener('keyup', search)

    // Insert it before the playlist
    playlistsNode.parentNode.insertBefore(searchBar, playlistsNode)
}

const createSearchBar = () => {
    const searchBarIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'

    // DIV
    const container = document.createElement('div')
    container.className =
        'input-content label-is-floating style-scope tp-yt-paper-input-container'
    container.style.paddingLeft = '2rem'
    container.style.paddingRight = '-2rem'
    container.style.paddingTop = '1rem'

    // IRON INPUT
    const ironInput = document.createElement('iron-input')
    ironInput.className = 'input-element style-scope tp-yt-paper-input'
    ironInput.innerHTML = searchBarIcon
    ironInput.getElementsByTagName('svg')[0].style.float = 'left'
    ironInput.getElementsByTagName('svg')[0].style.position = 'relative'

    // SEARCH BAR
    const searchBar = document.createElement('input')
    searchBar.placeholder = 'Search...'
    searchBar.className = 'style-scope tp-yt-paper-input'
    searchBar.style.minWidth = '80%'
    searchBar.style.width = 'auto'
    searchBar.style.display = 'inline-block'

    ironInput.appendChild(searchBar)
    container.appendChild(ironInput)

    return container
}

/**
 * Adds the event listener to the "SAVE" button on YouTube.
 * Right now playlists come back unsorted but this allows for them to
 * come back sorted so finding them is easier.
 */
const addEventListenerToSaveButton = async () => {
    console.debug('Running YouTube sorter...')
    const timeoutDelay = 500
    const intervalDelay = 10
    const tries = 200

    const selector = '#menu-container ytd-button-renderer'
    const menuButtons = await YouTubeHelpers.findNodes(
        selector,
        intervalDelay,
        tries
    )
    const saveButton = [].slice
        .call(menuButtons, 0)
        .find((p) => p.innerText.toLowerCase() === 'save')

    // Run this when the "SAVE" button is clicked
    saveButton.addEventListener('click', async function () {
        let currentMutationsCount = 0
        let nextMutationsCount = 0
        const playlistDivSelector = '#playlists'
        const playlistsSelector = 'ytd-playlist-add-to-option-renderer'

        const observer = new MutationObserver((mutations) => {
            nextMutationsCount += mutations.length
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        })

        const func = () => {
            console.debug('Waiting for all playlists to load...')

            const playlistDiv = YouTubeHelpers.findNode(playlistDivSelector)

            if (!playlistDiv) {
                console.debug('Could not find the playlist div...')
                return
            }

            if (currentMutationsCount == nextMutationsCount) {
                // stop watching observer
                observer.disconnect()
                console.debug('Sorting the playlists...')
                sortAndUpdateParentChildren(
                    playlistDivSelector,
                    playlistsSelector
                )

                addSearchField(playlistDivSelector, playlistsSelector)

                return true
            }

            // Update current count
            currentMutationsCount = nextMutationsCount

            return false
        }

        await YouTubeHelpers.setTimeoutIntervalAsync(
            func,
            timeoutDelay,
            intervalDelay,
            tries
        )
    })
}
/**
 * Run the program
 */
addEventListenerToSaveButton().finally(() => {
    console.debug('Done')
})
