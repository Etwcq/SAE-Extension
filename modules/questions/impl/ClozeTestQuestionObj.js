import { AnswerParser } from "../../AnswerParser.js";
import { ReactDOMUtils } from "../../ReactDOMUtils.js";
import { QuestionObj } from "../QuestionObj.js";

export class ClozeTestQuestionObj extends QuestionObj {
    constructor() {
        super();
    }

    /*
    入力エリアのHTML: <span class="InputTextBox__root___d0VEz"><input type="text" autocapitalize="off" value=""></span>
    */
    static INPUT_BOX_CLASS = "InputTextBox__root___d0VEz";

    parse(xmlElem) {
        console.log(xmlElem);

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

        this.questionBox.appendChild(AnswerParser.getAnswerBoxDiv(this.answer.join(' / ')));

        this.isRendered = true;
    }

    doAnswer() {
        if (!this.isRendered) {
            return;
        }

        const inputBoxes = this.questionBox.querySelectorAll(`.${ClozeTestQuestionObj.INPUT_BOX_CLASS} input`);
        
        let aIndex = 0;
        inputBoxes.forEach((inputBox) => {
            ReactDOMUtils.changeInputValue(inputBox, this.answer[aIndex++]);
        });
    }

    static getBoxTagName() {
        return "ClozeTestQuestionBuilder__questionBox___3gzPV";
    }
}