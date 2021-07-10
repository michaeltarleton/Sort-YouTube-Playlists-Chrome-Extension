
try {
  console.debug("start");
  // @ts-ignore
  // chrome.action.onClicked.addListener((tab) => {
  //   // @ts-ignore
  //   // chrome.scripting.executeScript({
  //   //   target: { tabId: tab.id },
  //   //   files: ["content-script.js"],
  //   // });
  // });
  console.debug("end");
} catch (e) {
  console.error(e);
}
