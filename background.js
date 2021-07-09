
try {
  console.log("start");
  chrome.action.onClicked.addListener((tab) => {
    console.log('test')
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"],
    });
  });
  console.log("end");
} catch (e) {
  console.error(e);
}
