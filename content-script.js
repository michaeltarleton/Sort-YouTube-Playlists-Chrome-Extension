class YouTubeHelpers {
  static findNode(selector) {
    var node = document.querySelector(selector);

    if (!node) {
      throw "Could not find " + selector;
    }

    console.debug("Found " + selector);

    return node;
  }

  static findNodes(selector) {
    var node = document.querySelectorAll(selector);

    if (!node) {
      throw "Could not find " + selector;
    }

    console.debug("Found " + selector);

    return node;
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
  console.log("Done adding sorted children");
};

const addEventListenerToSaveButton = function () {
  console.debug("Running YouTube sorter...");
  const selector = "#menu-container ytd-button-renderer";
  const menuButtons = YouTubeHelpers.findNodes(selector);
  const saveButton = [].slice
    .call(menuButtons, 0)
    .find((p) => p.innerText.toLowerCase() === "save");

  saveButton.addEventListener("click", function () {
    const initialDelay = 1000;
    const intervalDelay = 250;
    const intervalMax = 10;
    let currentIntervalCount = 0;
    let currentMutationsCount = 0;
    let nextMutationsCount = 0;

    const observer = new MutationObserver((mutations) => {
      // console.debug("mutations found");
      nextMutationsCount += mutations.length;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    setTimeout(() => {
      const interval = setInterval(() => {
        try {
          if (currentIntervalCount >= intervalMax) {
            console.debug("Reached the end of the line...");
            clearInterval(interval);
            return;
          }

          const playlistDivSelector = "#playlists";
          const playlistDiv = document.querySelector(playlistDivSelector);

          if (!playlistDiv) {
            console.debug("Could not find the playlist div...");
            return;
          }

          if (currentMutationsCount == nextMutationsCount) {
            // stop watching observer
            observer.disconnect();
            console.debug("Sorting the playlists");
            sortAndUpdateParentChildren(
              "#playlists",
              "ytd-playlist-add-to-option-renderer"
            );

            // Stop loop
            clearInterval(interval);
          }

          // Update current count
          currentMutationsCount = nextMutationsCount;
          // Increment interval count
          currentIntervalCount++;
        } catch {
          clearInterval(interval);
        }
      }, intervalDelay);
    }, initialDelay);
  });
};

addEventListenerToSaveButton();
