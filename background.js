
try {
  console.log("start");
  // @ts-ignore
  // chrome.action.onClicked.addListener((tab) => {
  //   console.log('test')
  //   // @ts-ignore
  //   // chrome.scripting.executeScript({
  //   //   target: { tabId: tab.id },
  //   //   files: ["content-script.js"],
  //   // });
  // });
  console.log("end");
} catch (e) {
  console.error(e);
}
