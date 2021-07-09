var sortParentChildren = function (parentSelector, childSelector) {
  const playlistDivSelector = "#playlists";
  var playlistDiv = document.querySelector(playlistDivSelector);

  if(!playlistDiv){
    console.error("Could not find " + playlistDivSelector);
    return;
  }
  console.debug("Found " + playlistDivSelector);
  console.log(playlistDiv);

  const playlistSelector = "ytd-playlist-add-to-option-renderer";
  var playlistNodes = playlistDiv.querySelectorAll(
    playlistSelector
  );
  var playlistsArray = Array.prototype.slice.call(playlistNodes, 0);



  
  if (!playlistNodes || playlistNodes.length == 0) {
    console.error("Could not find " + playlistSelector);
    return;
  }
  console.debug("Found " + playlistSelector);
  console.log(playlistNodes);



  var sortedPlaylists = playlistsArray.sort((a, b) =>
    a.innerText === b.innerText ? 0 : a.innerText > b.innerText ? 1 : -1
  );

  // Clear the current DIV HTML
  playlistDiv.innerHTML = "";

  // Add the sorted array back in
  console.log('sorting')
  console.log(sortedPlaylists)

  sortedPlaylists.forEach((p) => playlistDiv.appendChild(p));
  console.log('done')
};

var samplesort = function () {
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
  saveButton.addEventListener("click", function () {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;

        for (let i = 0; i < mutation.addedNodes.length; i++) {
          // do things to your newly added nodes here
          let node = mutation.addedNodes[i];
          sortParentChildren(
            "#playlists",
            "ytd-playlist-add-to-option-renderer"
          );
        }
        // stop watching using:
        observer.disconnect();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    
  });
};

samplesort();






