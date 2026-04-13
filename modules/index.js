import { AnswerXmlRetriever } from "./AnswerXmlRetriever.js";
import { AnswerParser } from "./AnswerParser.js";
import { MixinLoader } from "./mixins/MixinLoader.js";
import { Settings } from "./Settings.js";
import { ReadingScanningCombinationQuestionObj } from "./questions/impl/ReadingScanningCombinationQuestionObj.js";
import { ReactDOMUtils } from "./ReactDOMUtils.js";

console.log("index.js loaded");

let axr = new AnswerXmlRetriever();
let cas = new AnswerParser(axr);

const updatePage = () => {
    document.body.appendChild(document.createElement('br'));
}

const initSAEMenu = () => {
    let csssrc = new URL('./sae_menu/style.css', import.meta.url).toString();
    let jssrc = (new URL('./sae_menu/script.js', import.meta.url)).toString();

    fetch(new URL('./sae_menu/index.html', import.meta.url))
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');

            let csslink = doc.createElement('link');
            csslink.rel = 'stylesheet';
            csslink.type = 'text/css';
            csslink.href = csssrc;

            let jslink = doc.createElement('script');
            jslink.type = 'module';
            jslink.src = jssrc;

            document.head.append(csslink);
            document.head.append(jslink);

            document.body.prepend(doc.querySelector("div"));
        });
};

const onQuestionPageUpdated = () => {
    ReadingScanningCombinationQuestionObj.currentCombinationQuestionIndex = 0; // Scanning組み合わせ問題のインデックスをリセット
};

const setAutoSubmit = () => {
    if (Settings.get('submitAutomatically').checked) {
        if (!Settings.get('answerAutomatically').checked) {
            alert("SAE: 自動提出を有効にするには、自動解答を有効にしてください。");
            Settings.modify('submitAutomatically', 'checked', false);

            return false;
        }

        let min = parseInt(Settings.get('submitLimitMinTime').value);
        let max = parseInt(Settings.get('submitLimitMaxTime').value);

        if (min < 30) {
            alert("SAE: 自動提出までの最小時間は30秒以上に設定してください。");
            Settings.modify('submitAutomatically', 'checked', false);

            return false;
        }

        if (min >= max) {
            alert("SAE: 自動提出までの最小時間は最大時間より小さくしてください。");
            Settings.modify('submitAutomatically', 'checked', false);

            return false;
        }

        let time = Math.floor(Math.random() * (max - min)) + min;
        window.playerModel.limitTime = time;

        // ポップアップを表示する
        let popup = document.createElement('div');
        let stopBtn = document.createElement('button');
        stopBtn.innerText = '自動提出を中止する';

        stopBtn.onclick = () => {
            Settings.modify('submitAutomatically', 'checked', false);
            popup.remove();
        };

        popup.id = 'autoAnswerPopup';
        popup.style.display = 'flex';
        popup.appendChild(document.createElement('br'));
        popup.appendChild(stopBtn);
        document.body.appendChild(popup);

        let style = document.createElement('style');
        style.innerHTML = `
  #autoAnswerPopup {
    position: fixed;
    font-size: 2em;
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

        return true;
    }

    return false;
}


// entry point
(() => {
    initSAEMenu();

    let autoAnswered = false;
    let retrieving = false; // answerXmlを取得中かどうか
    let submitTimeSet = false; // 自動提出時間が設定されたかどうか

    // 毎ティックごとに実行する関数   
    function onTick() {
        if (!axr.isValueSet()) {
            axr.auToken = AnswerXmlRetriever.retrieveAuToken();
            axr.cfcMethod = AnswerXmlRetriever.retrieveCfcMethod();
        } else {
            if (!retrieving && !cas.isParsed) {
                fetch(axr.answerXmlUrl).then((response) => {
                    return response.text();
                }).then((text) => {
                    cas.answerXml = text;
                    cas.parse();

                    console.log("answerXml retrieved");
                    retrieving = false;
                });

                retrieving = true;
            } else {
                if (cas.isRendered) {
                    // 問題ページが更新されたら
                    if (!AnswerParser.isSAEAnswerBoxExists()) {
                        console.log("question page updated");

                        cas.isRendered = false;

                        if (cas.lastQuestionIndex.length != 0) { // あるかわからんけどもし問題数が0を切る
                            cas.lastQuestionIndex = cas.parsedQuestionIndices[cas.parsedQuestionIndices.length - 1] + 1;
                        }

                        cas.parse();
                        autoAnswered = false;

                        onQuestionPageUpdated();
                    }
                }
            }

            cas.render();

            // 自動提出時間が設定されていなければ設定する
            if (!submitTimeSet) {
                if (window.playerModel.limitTime !== undefined) {
                    if (setAutoSubmit()) submitTimeSet = true;
                }
            }

            // 問題ページを開いたら自動で解答する
            if (!autoAnswered && Settings.get('answerAutomatically').checked && cas.isRendered) {
                const ansBtn = document.querySelector(`[class*="${AnswerParser.ANS_BTN_CLASS}"]`);
                if (ansBtn !== null && ansBtn !== undefined) {
                    cas.questions.forEach((q) => q.doAnswer());
                    autoAnswered = true;
                }

                if (submitTimeSet && Settings.get('submitAutomatically').checked) {
                    const nextBtn = document.getElementById('nextButton');

                    if (nextBtn !== null && nextBtn !== undefined && !nextBtn.disabled) {
                        let milsec = Math.floor(Math.random() * (2000 - 1000)) + 1000;
                        setTimeout(() => {
                            ReactDOMUtils.clickButton(nextBtn);
                        }, milsec);
                    }
                }
            }
            
            /*
            if (Settings.get('showExplanation').checked) {
                window.playerModel.explainDisplay = true;
                window.playerModel.explainDisplayScore = -1;
            }
            */
        }
    }

    function everyMinute() {
        if (Settings.get('noLearningTimeTimeout').checked) {
            $(document.body).trigger('mousemove'); // マウスを動かすことで学習時間のカウントを維持する
        }
    }

    setInterval(onTick, 100);
    setInterval(everyMinute, 60 * 1000);
    MixinLoader.load();
})();