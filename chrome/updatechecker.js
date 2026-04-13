const REV = 41;
const VERSIONS_URL = "https://raw.githubusercontent.com/Etwcq/saee.health/main/files/versions.xml";
const PACKAGE_URL = "https://chrome.google.com/webstore/detail/saeextension/ainhdckpnmekihjcnoebolnobohffidm";

console.log("checking for updates...");

(() => {
    fetch(VERSIONS_URL).then((response) => {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.text();
    }).then((text) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        const versions = xmlDoc.querySelectorAll('versions version');
        let latest = versions[0];

        for (let version of versions) {
            const rev = parseInt(version.querySelector('rev').textContent.trim());
            console.log(rev);
            if (rev > REV) {
                if (parseInt(latest.querySelector('rev').textContent.trim()) < rev) {
                    latest = version;
                }
            }
        }

        const latestRev = parseInt(latest.querySelector('rev').textContent.trim());
        const latestDesc = latest.querySelector('description').textContent.trim();

        const revToVersion = (rev) => {
            const major = Math.floor(rev / 100);
            const minor = Math.floor((rev % 100) / 10);
            const patch = (rev % 100) % 10;

            return `${major}.${minor}.${patch}`;
        }

        if (REV < latestRev) {
            console.log("update available");
            let c = confirm(`SAEのアップデートがあります: ${revToVersion(latestRev)} (現在: ${revToVersion(REV)})\n*${latestDesc}\n\nアップデートページを開きますか？\nTwitter: @etwcq6072`);

            if (c) {
                window.open(PACKAGE_URL, '_blank');
            }
        } else {
            console.log("no update available");
        }
    });
})();
