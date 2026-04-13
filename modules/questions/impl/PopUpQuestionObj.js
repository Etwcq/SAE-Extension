import { AnswerParser } from "../../AnswerParser.js";
import { ReactDOMUtils } from "../../ReactDOMUtils.js";
import { QuestionObj } from "../QuestionObj.js";

export class PopUpQuestionObj extends QuestionObj {
    constructor() {
        super();
    }

    static QUESTION_CLASS = "PopUpQuestionBuilder__question___2RVzm";

    parse(xmlElem) {
        let choices = {};

        this.no = xmlElem.getAttribute('no');
        this.direction = xmlElem.querySelector('direction').textContent.trim();
        this.answer = xmlElem.querySelector('answers answer').textContent.trim();
        xmlElem.querySelectorAll('choices choice').forEach((choiceElement) => {
            const key = choiceElement.getAttribute('no');
            const value = choiceElement.textContent.trim();
            choices[key] = value;
        });
        this.choices = choices;

        return this;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        if (this.questionBox === undefined) {
            console.error("questionBox is undefined");
            return;
        }

        this.questionBox.appendChild(AnswerParser.getAnswerBoxDiv(this.choices[this.answer]));

        this.isRendered = true;
    }

    doAnswer() {
        if (!this.isRendered) {
            return;
        }

        const btn = this.questionBox.querySelector("button");
        ReactDOMUtils.clickButton(btn);

        const spans = document.querySelectorAll('span');
        const ans = this.choices[this.answer];

        for (let span of spans) {
            if (span.textContent.trim() === ans) {
                ReactDOMUtils.clickButton(span);
            }
        }

    }

    isRightXMLQuestionElement(questionElement) {
        const spans = this.questionBox.querySelector(`.${PopUpQuestionObj.QUESTION_CLASS}`).querySelectorAll("span");
        const spanTexts = Array.from(spans).map((s) => s.textContent.trim());
        const sText = spanTexts.join(" ").replaceAll(".", "").replaceAll("  ", " ").trim();

        const questionText = questionElement.querySelector("questionText").textContent
        .replaceAll("*", "")
        .replaceAll(".", "")
        .replaceAll("  ", " ")
        .replace(/[\r\n]/g, "") // 2024/12/17 追加
        .trim(); // 無理やりすぎる

        // console.log("spanTexts: " + sText);
        // console.log("questionText: " + questionText);
        return sText === questionText || sText.includes(questionText) || questionText.includes(sText);
    }

    static getBoxTagName() {
        return "PopUpQuestionBuilder__questionBox___2jQ5D";
    }
}