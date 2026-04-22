chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== 'clear') return false;

  chrome.browsingData
    .remove({ origins: [message.origin] }, message.data)
    .then(() => {
      sendResponse({ ok: true });
      return chrome.tabs.reload(message.tabId);
    })
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
