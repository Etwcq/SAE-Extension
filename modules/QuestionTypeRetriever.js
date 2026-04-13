import { QuestionObj } from "./questions/QuestionObj.js";
import { AnaumeFilInQuestionObj } from "./questions/impl/AnaumeFilInQuestionObj.js";
import { ClozeTestQuestionObj } from "./questions/impl/ClozeTestQuestionObj.js";
import { InsertionQuestionObj } from "./questions/impl/InsertionQuestionObj.js";
import { MatchingQuestionObj } from "./questions/impl/MatchingQuestionObj.js";
import { MultipleChoicesQuestionObj } from "./questions/impl/MultipleChoicesQuestionObj.js";
import { PopUpQuestionObj } from "./questions/impl/PopUpQuestionObj.js";
import { ReadingScanningCombinationQuestionObj } from "./questions/impl/ReadingScanningCombinationQuestionObj.js";
import { VocabularyMultipleChoicesQuestionObj } from "./questions/impl/VocabularyMultipleChoicesQuestionObj.js";

export class QuestionTypeRetriever {
    constructor() {
        this._questionLength = 0;
        this._questionBoxes = [];
        this._allQuestionBoxes = [];
    }

    static QUESTION_MODELS = [
        new MultipleChoicesQuestionObj(),
        new ClozeTestQuestionObj(),
        new PopUpQuestionObj(),
        new AnaumeFilInQuestionObj(),
        new InsertionQuestionObj(),
        new MatchingQuestionObj(),
        new VocabularyMultipleChoicesQuestionObj(),
        new ReadingScanningCombinationQuestionObj()
    ];

    /**
     * Setter for the question length.
     * @param {number} questionLength - The length of the question.
     */
    set questionLength(questionLength) {
        this._questionLength = questionLength;
    }

    /**
     * Gets the length of the question.
     * @returns {number} The length of the question.
     */
    get questionLength() {
        return this._questionLength;
    }

    /**
     * Setter for the supported questionBoxes property.
     *
     * @param {Array} questionBoxes - The array of question boxes.
     */
    set questionBoxes(questionBoxes) {
        this._questionBoxes = questionBoxes;
    }

    /**
     * Gets the supported question boxes.
     *
     * @returns {Array} The question boxes.
     */
    get questionBoxes() {
        return this._questionBoxes;
    }

    /**
     * Setter for allQuestionBoxes, including not supported one.
     * @param {Array} allQuestionBoxes - The array of all question boxes.
     */
    set allQuestionBoxes(allQuestionBoxes) {
        this._allQuestionBoxes = allQuestionBoxes;
    }

    /**
     * Gets all the question boxes, including not supported one.
     *
     * @returns {Array} The array of question boxes.
     */
    get allQuestionBoxes() {
        return this._allQuestionBoxes;
    }

    /**
     * Finds question models and returns an array of their copies.
     * @returns {Array<QuestionObj>} An array of question model copies.
     */
    findAll() {
        let allDivs = document.querySelectorAll("div");
        let qms = [];

        for (let div of allDivs) {
            for (let q of QuestionTypeRetriever.QUESTION_MODELS) {
                let boxTag = q.getBoxTag();
                if (div.classList.contains(boxTag)) {
                    let qObj = new q.constructor();
                    qObj.questionBox = div;
                    qms.push(qObj);
                }
            }
        }

        // 非対応も
        this.allQuestionBoxes = Array.from(allDivs).filter((div) => {
            for (let c of div.classList) {
                if (c.includes("questionBox")) {
                    return true;
                }
            }
        });

        this.questionLength = this.allQuestionBoxes.length;
        this.questionBoxes = qms;

        return qms;
    }
}