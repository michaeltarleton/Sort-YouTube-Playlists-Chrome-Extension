class YouTubeHelpers {
  /**
   * Returns an element from the DOM
   * @param {string} selector
   * @returns {Element}
   */
  static findNode(selector) {
    var node = document.querySelector(selector);

    if (!node) {
      throw "Could not find " + selector;
    }

    console.debug("Found " + selector);

    return node;
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
      let intervalCount = 0;
      const interval = setInterval(() => {
        console.debug(`Trial: ${intervalCount}`);
        if (intervalCount++ >= tries) {
          console.debug(
            `intervalCount++ >= tries: ${intervalCount++ >= tries}`
          );
          clearInterval(interval);
          return reject();
        }

        try {
          console.debug(`Running func`);
          const result = func();
          console.debug(`Done Running func`, result);

          if (result) {
            clearInterval(interval);
            return resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
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
          const result = func();
          return resolve(result);
        } catch (e) {
          return reject(e);
        }
      }, delay);
    });
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
      return await YouTubeHelpers.setIntervalAsync(func, interval, tries);
    }, timeout);
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
      var node = document.querySelectorAll(selector);

      if (!node) {
        throw "Could not find " + selector;
      }

      if (node.length == 0) {
        return;
      }

      console.debug("Found " + selector);

    /**
     * Async version of setInterval
     * @param {Function} func
     * @param {Number} delay
     * @param {Number} tries
     * @returns {Promise<any>}
     */
    static setIntervalAsync(func, delay, tries) {
        return new Promise((resolve, reject) => {
            let intervalCount = 0;
            const interval = setInterval(() => {
                if (intervalCount++ >= tries) {
                    clearInterval(interval);
                    return reject();
                }

                try {
                    const result = func();
                    if (result) {
                        clearInterval(interval);
                        return resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
            }, delay);
        });
    }

    return await YouTubeHelpers.setIntervalAsync(
      func,
      delay,
      tries
    );
  }

  /**
   * Finds all children for a parent node
   * @param {Element} parentNode Node to select children from
   * @param {String} childSelector Child selector
   * @returns {NodeListOf<Element>}
   */
  static findChildNodes(parentNode, childSelector) {
    var childNodes = parentNode.querySelectorAll(childSelector);

    /**
     * Finds all the nodes based on a selector
     * @param {String} selector
     * @returns {Promise<NodeListOf<Element>>}
     */
    static async findNodes(selector) {
        const func = () => {
            var node = document.querySelectorAll(selector);

            if (!node) {
                throw "Could not find " + selector;
            }

            if (node.length == 0) {
                return;
            }

            return node;
        };

        return await YouTubeHelpers.setIntervalAsync(
            func,
            this.intervalDelay,
            this.maxInterval
        );
    }

    /**
     * Finds all children for a parent node
     * @param {Element} parentNode Node to select children from
     * @param {String} childSelector Child selector
     * @returns {NodeListOf<Element>}
     */
    static findChildNodes(parentNode, childSelector) {
        var childNodes = parentNode.querySelectorAll(childSelector);

        if (!childNodes || childNodes.length == 0) {
            throw "Could not find " + childSelector;
        }
        return childNodes;
    }

    static clearNodeChildren(node) {
        node.innerHTML = "";
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
    const parentNode = YouTubeHelpers.findNode(parentSelector);
    const childNodes = YouTubeHelpers.findChildNodes(parentNode, childSelector);

    const childNodesArray = [].slice.call(childNodes, 0);
    const sortedChildNodesArray = childNodesArray.sort((a, b) =>
        a.innerText === b.innerText ? 0 : a.innerText > b.innerText ? 1 : -1
    );

    // Clear the current DIV HTML
    YouTubeHelpers.clearNodeChildren(parentNode);

    // Add the sorted array back in
    sortedChildNodesArray.forEach((p) => parentNode.appendChild(p));
};
/**
 * Adds the event listener to the "SAVE" button on YouTube.
 * Right now playlists come back unsorted but this allows for them to
 * come back sorted so finding them is easier.
 */
const addEventListenerToSaveButton = async () => {
  console.debug("Running YouTube sorter...");
  const timeoutDelay = 500;
  const intervalDelay = 10;
  const tries = 200;

  const selector = "#menu-container ytd-button-renderer";
  const menuButtons = await YouTubeHelpers.findNodes(
    selector,
    intervalDelay,
    tries
  );
  const saveButton = [].slice
    .call(menuButtons, 0)
    .find((p) => p.innerText.toLowerCase() === "save");

  +(
    // Run this when the "SAVE" button is clicked
    saveButton.addEventListener("click", async function () {
      let currentMutationsCount = 0;
      let nextMutationsCount = 0;
      const playlistDivSelector = "#playlists";
      const playlistsSelector = "ytd-playlist-add-to-option-renderer";

      const observer = new MutationObserver((mutations) => {
        nextMutationsCount += mutations.length;
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });

      const func = () => {
        console.debug("Waiting for all playlists to load...");

        const playlistDiv = YouTubeHelpers.findNode(playlistDivSelector);

        if (!playlistDiv) {
          console.debug("Could not find the playlist div...");
          return;
        }

        if (currentMutationsCount == nextMutationsCount) {
          // stop watching observer
          observer.disconnect();
          console.debug("Sorting the playlists...");
          sortAndUpdateParentChildren(playlistDivSelector, playlistsSelector);

          return true;
        }

        // Update current count
        currentMutationsCount = nextMutationsCount;

        return false;
      };

      await YouTubeHelpers.setTimeoutIntervalAsync(
        func,
        timeoutDelay,
        intervalDelay,
        tries
      );
    })
  );
};
/**
 * Run the program
 */
addEventListenerToSaveButton().finally(() => {
  console.debug("Done");
});
