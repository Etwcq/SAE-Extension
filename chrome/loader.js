console.log(`Launching SAE Extension v${chrome.runtime.getManifest().version} by @etwcq6072; A powerful chrome extension helping you to finish irritating AE3!`);

let isLicensed = false;
let username = undefined;

const load = async (username) => {
    const exid = chrome.runtime.id
    const elid = exid + "-script"

    if (document.getElementById(elid)) {
        return;
    }

    const scr = document.createElement("script");
    scr.id = elid;
    scr.src = chrome.runtime.getURL('../modules/index.js');
    scr.type = "module";
    document.head.append(scr);

    console.log("loaded SAE modules!");

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('../api/react-trigger-change.js');
    document.head.appendChild(script);

    const usrdiv = document.createElement('div');
    usrdiv.id = 'sae-username';
    usrdiv.setAttribute('username', username);
    document.body.appendChild(usrdiv);

    await chrome.storage.local.get(["sae_settings"]).then((result) => {
        const settings = result.sae_settings;
        console.log("Settings: " + settings);
        
        const setting = document.createElement('div');
        setting.id = 'sae-setting';
        setting.style.display = 'none';

        if (settings !== undefined) {
            setting.innerText = settings;
        }

        document.body.appendChild(setting);
    });
};

window.onload = async (e) => {
    // HTML
    // ポップアップ要素を追加します。初めは非表示にします。
    var popup = document.createElement('div');
    popup.id = 'loadingPopup';
    popup.style.display = 'none';
    popup.innerText = 'SAE: 読み込み中...';
    document.body.appendChild(popup);

    // CSS
    // ポップアップのスタイルを定義します。
    var style = document.createElement('style');
    style.innerHTML = `
  #loadingPopup {
    position: fixed;
    font-size: 5em;
    font-family: sans-serif;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
`;
    document.head.appendChild(style);

    // JavaScript
    // 非同期処理が開始される前にポップアップを表示します。
    document.getElementById('loadingPopup').style.display = 'flex';


    // ライセンス認証
    const LICENSE_SERVICE = "";
    let localLicense = undefined;

    await chrome.storage.local.get(["sae_license"]).then((result) => {
        console.log("Local license is " + result.sae_license);
        localLicense = result.sae_license;
    });

    if (localLicense === undefined) {
        alert("SAE: ライセンスキーが設定されていません。ライセンスキーの発行を依頼して、設定してください。");
        document.getElementById('loadingPopup').style.display = 'none';

        return;
    }

    await fetch(LICENSE_SERVICE + "?licenseKey=" + localLicense).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.text();
    }).then((text) => {
        let responseObj = JSON.parse(text);

        if (responseObj._name === undefined) {
            alert("SAE: ライセンスキーが不正です。ライセンスキーの発行を依頼して、設定してください。");
            return;
        }

        console.log("ライセンスキーが正常に認証されました。");
        console.log(`Current user: ${responseObj._name} (${responseObj._id})`);

        username = responseObj._name;
        isLicensed = true;
    });

    // おとおさんとね、はじめてかいたイフぶん
    // 消さないでね！
    if (isLicensed) {
        load(username);
    }

    // 非同期処理が終了した後にポップアップを非表示にします。
    // このコードは非同期処理の.then()または.finally()ブロック内に配置します。
    document.getElementById('loadingPopup').style.display = 'none';
}
