var sortParentChildren = function (parentSelector, childSelector) {
  var parentNode = document.querySelector(parentSelector);

  if (!parentNode) {
    console.error("Could not find " + parentSelector);
    return;
  }
  // console.debug("Found " + parentSelector);
  // console.log(parentNode);

  var childNodes = parentNode.querySelectorAll(childSelector);
  var childNodesArray = Array.prototype.slice.call(childNodes, 0);

  if (!childNodes || childNodes.length == 0) {
    console.error("Could not find " + childSelector);
    return;
  }
  // console.debug("Found " + childSelector);
  // console.log(childNodes);

  // var sortedChildNodesArray = childNodesArray.sort((a, b) =>
  //   a.innerText === b.innerText ? 0 : a.innerText > b.innerText ? 1 : -1
  // );

  // Clear the current DIV HTML
  // parentNode.innerHTML = "";

  // Add the sorted array back in
  // console.log('sorting')
  // console.log(sortedChildNodesArray)

  // sortedChildNodesArray.forEach((p) => parentNode.appendChild(p));
  console.log("done");
};

var run = function () {
  console.debug("samplesort called");
  const selector = "#menu-container ytd-button-renderer";
  const menuButtons = document.querySelectorAll(selector);
  const saveButton = Array.from(menuButtons).find(
    (p) => p.innerText.toLowerCase() === "save"
  );

  if (!saveButton) {
    console.error("Could not find " + selector);
    return;
  }

  console.debug("Found " + selector);
  // saveButton.addEventListener("click", function () {
  //   sortParentChildren("#playlists", "ytd-playlist-add-to-option-renderer");
  // });

  // wait 1 s
  // check for mutations
  // wait 1 s
  // check for mutations
  // if none; then sort; otherwise wait 1 s

  saveButton.addEventListener("click", function () {
    let currentMutationsCount = 0;
    let nextMutationsCount = 0;
    let currentIntervalCount = 0;
    let intervalMax = 10;

    let observer = new MutationObserver((mutations) => {
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
      let interval = setInterval(() => {
        if (currentIntervalCount >= intervalMax) {
          console.debug("Reached the end of the line...");
          clearInterval(interval);
          return;
        }

        const playlistDivSelector = "#playlists";
        var playlistDiv = document.querySelector(playlistDivSelector);

        if (!playlistDiv) {
          console.debug("Could not find the playlist div...");
          return;
        }

        if (currentMutationsCount == nextMutationsCount) {
          // stop watching observer
          observer.disconnect();
          console.debug("Sorting the playlists");
          sortParentChildren(
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
      }, 1000);
    }, 1000);
  });
};

run();
