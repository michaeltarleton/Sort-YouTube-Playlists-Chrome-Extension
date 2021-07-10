class YouTubeHelpers {
  static maxInterval = 10;
  static intervalDelay = 50;

  static findNode(selector) {
    var node = document.querySelector(selector);

    if (!node) {
      throw "Could not find " + selector;
    }

    console.debug("Found " + selector);

    return node;
  }

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

          if(result) {
            clearInterval(interval);
            return resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
  }

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

  static async setTimeoutIntervalAsync(func, timeout, interval, tries) {
    return await YouTubeHelpers.setTimeoutAsync(async () => {
      return await YouTubeHelpers.setIntervalAsync(func, interval, tries);
    }, timeout);
  }

  static async findNodes(selector) {
    const func = () => {
      var node = document.querySelectorAll(selector);

      if (!node) {
        throw "Could not find " + selector;
      }

      if (node.length == 0) {
        return;
      }

      console.debug("Found " + selector);

      return node;
    };

    return await YouTubeHelpers.setIntervalAsync(
      func,
      this.intervalDelay,
      this.maxInterval
    );
  }

  static findChildNodes(parentNode, childSelector) {
    var childNodes = parentNode.querySelectorAll(childSelector);

    if (!childNodes || childNodes.length == 0) {
      throw "Could not find " + childSelector;
    }
    console.debug("Found children" + childSelector);

    return childNodes;
  }

  static clearNodeChildren(node) {
    node.innerHTML = "";
  }
}

const sortAndUpdateParentChildren = function (parentSelector, childSelector) {
  const parentNode = YouTubeHelpers.findNode(parentSelector);
  const childNodes = YouTubeHelpers.findChildNodes(parentNode, childSelector);

  console.debug("sorting children");
  const childNodesArray = [].slice.call(childNodes, 0);
  const sortedChildNodesArray = childNodesArray.sort((a, b) =>
    a.innerText === b.innerText ? 0 : a.innerText > b.innerText ? 1 : -1
  );

  // Clear the current DIV HTML
  YouTubeHelpers.clearNodeChildren(parentNode);

  // Add the sorted array back in
  sortedChildNodesArray.forEach((p) => parentNode.appendChild(p));
  console.debug("Done adding sorted children");
};

const addEventListenerToSaveButton = async () => {
  console.debug("Running YouTube sorter...");
  
  const selector = "#menu-container ytd-button-renderer";
  const menuButtons = await YouTubeHelpers.findNodes(selector);
  const saveButton = [].slice
    .call(menuButtons, 0)
    .find((p) => p.innerText.toLowerCase() === "save");

  saveButton.addEventListener("click", async function () {
    const timeoutDelay = 500;
    const intervalDelay = 10;
    const intervalMax = 50;
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
      intervalMax
    );
  });
};

addEventListenerToSaveButton().finally(() => {
  console.debug("Done");
});
