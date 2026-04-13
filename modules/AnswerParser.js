import { QuestionTypeRetriever } from "./QuestionTypeRetriever.js";
import { VocabularyMultipleChoicesQuestionObj } from "./questions/impl/VocabularyMultipleChoicesQuestionObj.js";


export class AnswerParser {
    constructor(answerXmlRetriever) {
        this._isParsed = false;
        this._isRendered = false;
        this._questions = [];
        this._parsedQuestionIndices = [];
        this._lastQuestionIndex = 0;
        this.answerXmlRetriever = answerXmlRetriever;
    }

    static ANS_DIV_CLASS = "sae_ext_ans";
    static NOTSUPPORTED_DIV_CLASS = "sae_ext_not_supported";
    static ANS_BTN_CLASS = "sae_ext_btn";
    static ANS_BTN_ID = "sae_ext_btn_id";

    set isParsed(isParsed) {
        this._isParsed = isParsed;
    }

    get isParsed() {
        return this._isParsed;
    }

    set isRendered(isRendered) {
        this._isRendered = isRendered;
    }

    get isRendered() {
        return this._isRendered;
    }

    set answerXml(answerXml) {
        this._answerXml = answerXml;
    }

    get answerXml() {
        return this._answerXml;
    }

    set questions(questions) {
        this._questions = questions;
    }

    get questions() {
        return this._questions;
    }

    set isShuffle(isShuffle) {
        this._isShuffle = isShuffle;
    }

    get isShuffle() {
        return this._isShuffle;
    }

    set parsedQuestionIndices(parsedQuestionIndices) {
        this._parsedQuestionIndices = parsedQuestionIndices;
    }

    get parsedQuestionIndices() {
        return this._parsedQuestionIndices;
    }

    set lastQuestionIndex(lastQuestionIndex) {
        this._lastQuestionIndex = lastQuestionIndex;
    }

    get lastQuestionIndex() {
        return this._lastQuestionIndex;
    }

    parse() {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.answerXml, 'text/xml');
        const qtr = new QuestionTypeRetriever();

        const currentQuestions = qtr.findAll();
        
        // なぜかNaNになることがあるので0にする 多分直前のページに問題がなかったときに起こる
        if (isNaN(this.lastQuestionIndex)) {
            this.lastQuestionIndex = 0;
        }

        // 単語テストだったら非対応としてひとまず消す TODO:
        let isVocabularyTest = currentQuestions.find((q) => q.getBoxTag() === VocabularyMultipleChoicesQuestionObj.getBoxTagName()) !== undefined;

        // 対応する問題がない
        if (isVocabularyTest || currentQuestions.length <= 0) {
            let qLen = qtr.questionLength;
            let qIndex = this.lastQuestionIndex;

            // 対応してない問題の数だけparsedQuestionIndicesに追加 TODO:
            for (let i = qIndex; i < qLen; i++) {
                if (!this.parsedQuestionIndices.includes(i)) {
                    this.parsedQuestionIndices.push(i);
                }
            }

            this.isParsed = true;
            return;
        }

        // 先にやると単語テストの時にバグる
        this.isShuffle = xmlDoc.querySelector('book').getAttribute('shuffleQuestions') === 'true';

        const questionElements = xmlDoc.querySelectorAll('question');

        if (questionElements.length <= 0) {
            console.error("question XML elements not found");
            return;
        }

        //questionsの各要素に対して、xmlDocから取得した情報を代入する

        if (this.isShuffle) { // シャッフルされる場合
            let qIndex = this.lastQuestionIndex;

            for (let q of currentQuestions) {
                for (let qElem of questionElements) {
                    if (q.isRightXMLQuestionElement(qElem)) {
                        q.parse(qElem);

                        if (!this.parsedQuestionIndices.includes(qIndex)) {
                            this.parsedQuestionIndices.push(qIndex);
                        }

                        qIndex++;
                        break;
                    }
                }
            }
        } else { // シャッフルされない場合
            let qIndex = this.lastQuestionIndex;

            for (let q of currentQuestions) {
                const qElem = questionElements[qIndex];
                q.parse(qElem);

                if (!this.parsedQuestionIndices.includes(qIndex)) {
                    this.parsedQuestionIndices.push(qIndex);
                }

                qIndex++;
            }
        }

        this.isParsed = true;
        this.questions = currentQuestions;

        return currentQuestions;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        console.log("rendering");

        if (!this.isParsed) {
            console.error("answerXml is not parsed yet");
            return;
        }

        const notSupportedBox = document.querySelector(`div.${AnswerParser.NOTSUPPORTED_DIV_CLASS}`);

        // 問題がない場合
        if (this.questions.length <= 0) {
            if (notSupportedBox === null) {
                const mainDiv = document.querySelector('[class*="MainView__main"]');

                // 問題ページではない
                if (mainDiv === undefined || mainDiv === null) {
                    this.isRendered = true;
                    return;
                }

                mainDiv.prepend(AnswerParser.getNotSupportedBoxDiv("このページには対応している問題がありません。<br>開発者に問題タイプの追加を依頼してください。", this.answerXmlRetriever.answerXmlUrl));
            }

            this.isRendered = true;
            return;
        }

        if (notSupportedBox !== null) {
            notSupportedBox.remove();
        }

        for (let q of this.questions) {
            q.render();
        }

        AnswerParser.renderAnswerButton(() => {
            try {
                for (let q of this.questions) {
                    if (this.isRendered && !q.isRendered) {
                        q.isRendered = true;
                    }

                    q.doAnswer();
                }
            } catch (e) {
                console.error(e);
                alert("この問題タイプはまだ自動解答に対応していません。");
            }
        });

        this.isRendered = true;
    }

    /**
     * Creates a new div element containing the answer box with the given answer.
     * @param {string} ans - The answer to be displayed in the answer box.
     * @returns {HTMLElement} - The newly created div element containing the answer box.
     */
    static getAnswerBoxDiv(ans) {
        const newElement = document.createElement('div');
        newElement.classList.add(AnswerParser.ANS_DIV_CLASS);
        newElement.innerHTML = `<div style="display: inline-block; background: #ff69b4; padding: 3px 10px; color: #ffffff;">
                                    <strong>解答</strong>
                                </div><br>
                                <div style="padding: 10px; border: 2px solid #ff69b4; font-family: sans-serif; text-align: center; ">
                                    ${ans}
                                </div>`;

        return newElement;
    }

    /**
     * Creates a not supported box div element with the given message.
     * 
     * @param {string} msg - The message to be displayed in the not supported box.
     * @returns {HTMLElement} - The newly created not supported box div element.
     */
    static getNotSupportedBoxDiv(msg, answerXmlUrl) {
        const newElement = document.createElement('div');
        newElement.classList.add(AnswerParser.NOTSUPPORTED_DIV_CLASS);
        newElement.innerHTML = `<div style="display: inline-block; background: #698FFF; padding: 3px 10px; color: #ffffff;">
                                    <strong>解答</strong>
                                </div><br>
                                <div style="padding: 10px; border: 2px solid #698FFF; font-family: sans-serif; text-align: center; ">
                                    ${msg}<br>
                                    <a href="${answerXmlUrl}" target="_blank">View raw</a>
                                </div>`;

        return newElement;
    }

    /**
     * Returns the type attribute of the given element.
     * @param {Element} elem - The element to get the type attribute from.
     * @returns {string} The value of the type attribute of the given element.
     */
    static getQusetionTypeFromElement(elem) {
        return elem.getAttribute('type');
    }

    /**
     * Checks if the SAE answer box exists in the current document.
     * @returns {boolean} True if the answer box exists, false otherwise.
     */
    static isSAEAnswerBoxExists() {
        return document.querySelector(`div.${AnswerParser.ANS_DIV_CLASS}`) !== null;
    }

    /**
     * Renders an answer button and adds it to the DOM.
     * @param {function} onButtonClick - The function to be executed when the button is clicked.
     */
    static renderAnswerButton(onButtonClick) {
        const lastAnsBtn = document.querySelector(`div.${AnswerParser.ANS_BTN_CLASS}`);
        if (lastAnsBtn !== null) {
            lastAnsBtn.remove();
        }

        // 自動解答ボタンを追加
        const mainDiv = document.querySelector('[class*="MainView__main"]');
        const autoAnswerButton = document.createElement('div');
        autoAnswerButton.classList.add(AnswerParser.ANS_BTN_CLASS);
        autoAnswerButton.style.textAlign = "center";
        autoAnswerButton.innerHTML = `<button id="${AnswerParser.ANS_BTN_ID}" style="background-color: #4CAF50; border: 4px solid #CCFFCC; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; transition: background-color 0.3s;">解答を入力する</button>`;
        mainDiv.prepend(autoAnswerButton);

        // ボタンにhoverを追加
        const button = document.getElementById(AnswerParser.ANS_BTN_ID);
        button.onmouseover = () => {
            button.style.backgroundColor = "#45a049";
        }
        button.onmouseout = () => {
            button.style.backgroundColor = "#4CAF50";
        }

        if (onButtonClick !== undefined) {
            button.addEventListener('click', onButtonClick);
        }
    }
}