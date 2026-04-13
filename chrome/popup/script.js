const button = document.getElementById("saveButton");
const keyInput = document.getElementById("licenseKeyInput");

button.addEventListener("click", () => {
    const license = keyInput.value;
    if (license === undefined || license === "") {
        alert("SAE: ライセンスキーを入力してください。");
        return;
    }

    chrome.storage.local.set({ sae_license: license }).then(() => {
        console.log(`License key is set to ${license}`);
        alert(`SAE: ライセンスキーを設定しました。`);
    });
});

document.getElementById("version").innerHTML = "v" + chrome.runtime.getManifest().version;