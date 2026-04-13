/* main */

console.log('content.js loaded');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'startMutationObserver') {
        startMutationObserver();
    }
});

function startMutationObserver() {
    const targetNode = document.documentElement;

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // HTMLが更新された時に呼ばれる

            const settingDiv = document.getElementById('sae-setting');
            const settings = settingDiv.innerText;

            chrome.storage.local.set({ sae_settings: settings }).then(() => {
                console.log(`Settings updated`);
            });
        });
    });

    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(targetNode, config);
}