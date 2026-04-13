import { AnswerParser } from "../../AnswerParser.js";
import { ReactDOMUtils } from "../../ReactDOMUtils.js";
import { QuestionObj } from "../QuestionObj.js";

export class ReadingScanningCombinationQuestionObj extends QuestionObj {
    constructor() {
        super();
    }

    static currentCombinationQuestionIndex = 0;

    parse(xmlElem) {
        this.no = xmlElem.getAttribute('no');
        this.direction = undefined;
        this.answer = xmlElem.querySelector('answers answer').textContent.trim();

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

        this.questionBox.prepend(AnswerParser.getAnswerBoxDiv(this.answer));

        this.isRendered = true;
    }

    doAnswer() {
        if (!this.isRendered) {
            return;
        }

        const choiceSpanTag = "ReadingScanningQuestionSentence__sentence___2DQLm";
        const sentencesDivTag = "ReadingScanningCombinationQuestionView__combinationMain___1BOE2"; // 本文はquestionBoxの子要素ではないので注意
        const combinationDivs = document.querySelectorAll(`div.${sentencesDivTag}`);
        
        if (combinationDivs.length <= ReadingScanningCombinationQuestionObj.currentCombinationQuestionIndex) {
            ReadingScanningCombinationQuestionObj.currentCombinationQuestionIndex = 0;
        }

        const combinationDiv = combinationDivs[ReadingScanningCombinationQuestionObj.currentCombinationQuestionIndex];

        const choiceBoxes = combinationDiv.querySelectorAll(`span.${choiceSpanTag}`);

        for (let choiceBox of choiceBoxes) {
            if (choiceBox.textContent.trim() === this.answer) {
                ReactDOMUtils.clickButton(choiceBox);
                break;
            }
        }

        ReadingScanningCombinationQuestionObj.currentCombinationQuestionIndex++;
    }

    static getBoxTagName() {
        return "ReadingScanningQuestionBuilder__questionBox___1fz0d";
    }
}