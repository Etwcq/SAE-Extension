import { AnswerParser } from "../../AnswerParser.js";
import { ReactDOMUtils } from "../../ReactDOMUtils.js";
import { QuestionObj } from "../QuestionObj.js";

export class AnaumeFilInQuestionObj extends QuestionObj {
    constructor() {
        super();
    }

    parse(xmlElem) {
        this.no = xmlElem.getAttribute('no');
        this.direction = xmlElem.querySelector('direction').textContent.trim();
        this.answer = xmlElem.querySelector('answers answer').textContent.trim(); // 問題が複数ある場合は"/"で区切られている

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

        this.questionBox.appendChild(AnswerParser.getAnswerBoxDiv(this.answer.replaceAll("/", " / ")));

        this.isRendered = true;
    }

    doAnswer() {
        if (!this.isRendered) {
            return;
        }

        const answers = this.answer.split("/");
        const answerInputs = this.questionBox.querySelectorAll("input");
        let i = 0;

        answerInputs.forEach((input) => {
            ReactDOMUtils.changeInputValue(input, answers[i++]);
        });
    }

    static getBoxTagName() {
        return "AnaumeFilInQuestionBuilder__questionBox___3MZtS";
    }
}