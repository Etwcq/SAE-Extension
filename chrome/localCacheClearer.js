console.log("localCacheClearer.js loaded");

chrome.storage.local.clear(() =>{
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    } else {
        console.log('Local storage is cleared.');
    }
});