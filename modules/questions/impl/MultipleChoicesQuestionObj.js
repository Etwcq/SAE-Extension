import { AnswerParser } from "../../AnswerParser.js";
import { ReactDOMUtils } from "../../ReactDOMUtils.js";
import { QuestionObj } from "../QuestionObj.js";

export class MultipleChoicesQuestionObj extends QuestionObj {
    constructor() {
        super();
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

    doAnswer() {
        if (!this.isRendered) {
            return;
        }

        const answerButtons = this.questionBox.querySelectorAll("button");
        for (let button of answerButtons) {
            let btnText = button.textContent.trim();
            if (btnText === this.choices[this.answer]) {
                ReactDOMUtils.clickButton(button);

                continue;
            }
        }
    }

    isRightXMLQuestionElement(questionElement) {
        const answerButtons = this.questionBox.querySelectorAll("button");
        const buttonTexts = Array.from(answerButtons).map((button) => button.textContent.trim());

        const choices = questionElement.querySelectorAll('choices choice')
        const choiceTexts = Array.from(choices).map((choiceElement) => choiceElement.textContent.trim());

        if (buttonTexts.length !== choiceTexts.length) {
            return false;
        }

        for (let buttonText of buttonTexts) {
            if (!choiceTexts.includes(buttonText)) {
                return false;
            }
        }

        return true;
    }

    static getBoxTagName() {
        return "MultipleChoiceQuestionBuilder__questionBox___3Sabe";
    }
}