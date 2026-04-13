import { AnswerParser } from "../../AnswerParser.js";
import { ReactDOMUtils } from "../../ReactDOMUtils.js";
import { QuestionObj } from "../QuestionObj.js";

export class InsertionQuestionObj extends QuestionObj {
    constructor() {
        super();
    }

    parse(xmlElem) {
        this.no = xmlElem.getAttribute('no');
        this.direction = xmlElem.querySelector('direction').textContent.trim();

        const qText = xmlElem.querySelector('questionText').textContent.trim();
        this.answer = qText.match(/\[(.*?)\]/g).map((val) => val.replace(/[\[\]]/g, ''));

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

        this.questionBox.prepend(AnswerParser.getAnswerBoxDiv(this.answer.join(' / ')));

        this.isRendered = true;
    }

    doAnswer() {
        if (!this.isRendered) {
            return;
        }

        const answerSpanClass = "InsertionQuestionBuilder__insertionPosition___3co5b";
        const answerChoicesSpanClass = "InsertionQuestionBuilder__insertChoice___2D96C";
        const answeredChoicesClass = "InsertionQuestionBuilder__select___234Pa";

        const answerSpans = document.querySelectorAll(`span.${answerSpanClass}`);

        for (let i = 0; i < answerSpans.length; i++) {
            let span = answerSpans[i];
            let ans = this.answer[i];

            ReactDOMUtils.clickButton(span);
            let answerChoices = document.querySelectorAll(`span.${answerChoicesSpanClass}`);
            for (let choice of answerChoices) {
                if (choice.classList.contains(answeredChoicesClass)) {
                    continue;
                }

                if (choice.textContent.trim() === ans.trim()) { // trim() is needed because of the space in the answer
                    ReactDOMUtils.clickButton(choice);
                    break;
                }
            }
        }

        const backgroundObj = document.body.getElementsByTagName("div")[document.body.getElementsByTagName("div").length - 1]
        ReactDOMUtils.clickButton(backgroundObj); // close the answer box
    }

    static getBoxTagName() {
        return "InsertionQuestionBuilder__questionBox___2_UxN";
    }
}