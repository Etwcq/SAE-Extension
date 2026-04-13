chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, { action: 'startMutationObserver' });
    }
});

// 更新通知
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.notifications.create("installed", {
            type: 'basic',
            iconUrl: '../resources/icon48.png',
            title: 'SAE Extension Installed',
            message: 'SAEがインストールされました。設定を変更するには、右上の拡張機能アイコンをクリックしてください。\nライセンスは、https://etwcq.github.io/saee/register で発行できます。',
            buttons: [
                {title: 'ライセンスを発行する'}
            ]
        });
    } else if (details.reason == "update") {
        chrome.notifications.create("updated", {
            type: 'basic',
            iconUrl: '../resources/icon48.png',
            title: 'SAE Extension Updated',
            message: `SAEがアップデートされました: ${chrome.runtime.getManifest().version}\n\n詳しくは、ホームページのバージョン履歴をご覧ください。`,
            buttons: [
                {title: '更新情報を見る'}
            ]
        });
    }
})

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    let url = '';

    switch (notificationId) {
        case 'updated':
            url = 'https://etwcq.github.io/saee/#versions'; break;
        case 'installed':
            url = 'https://etwcq.github.io/saee/register'; break;
        default:
            break;
    }

    if (buttonIndex === 0) {
        chrome.tabs.create({url: url});
    }
});