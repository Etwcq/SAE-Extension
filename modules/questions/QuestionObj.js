/**
 * Represents a question object.
 * @class
 */
export class QuestionObj {
    /**
     * Setter for the question number.
     * @param {string} no - The question number.
     */
    set no(no) {
        this._no = no;
    }

    /**
     * Getter for the question number.
     * @returns {string} The question number.
     */
    get no() {      
        return this._no;
    }

    /**
     * Setter for the question direction.
     * @param {string} direction - The question direction.
     */
    set direction(direction) {
        this._direction = direction;
    }

    /**
     * Getter for the question direction.
     * @returns {string} The question direction.
     */
    get direction() {
        return this._direction;
    }

    /**
     * Setter for the question answer.
     * @param {any} answer - The question answer.
     */
    set answer(answer) {    
        this._answer = answer;
    }

    /**
     * Getter for the question answer.
     * @returns {any} The question answer.
     */
    get answer() {
        return this._answer;
    }

    /**
     * Setter for the question choices.
     * @param {Array} choices - The question choices.
     */
    set choices(choices) {
        this._choices = choices;
    }

    /**
     * Getter for the question choices.
     * @returns {Array} The question choices.
     */
    get choices() {
        return this._choices;
    }

    /**
     * Setter for the question box.
     * @param {HTMLElement} questionBox - The HTML element representing the question box.
     */
    set questionBox(questionBox) {
        this._questionBox = questionBox;
    }

    /**
     * Getter for the question box.
     * @returns {HTMLElement} The HTML element representing the question box.
     */
    get questionBox() {
        return this._questionBox;
    }

    /**
     * Setter for the isRendered property.
     * @param {boolean} isRendered - Whether or not the question is rendered.
     */
    set isRendered(isRendered) {
        this._isRendered = isRendered;
    }

    /**
     * Returns whether or not the question has been rendered.
     * @returns {boolean} Whether or not the question has been rendered.
     */
    get isRendered() {
        return this._isRendered;
    }

    /**
     * Set the question type.
     * @param {string} questionType - The type of the question.
     */
    set questionType(questionType) {
        this._questionType = questionType;
    }

    /**
     * Returns the type of the question.
     * @returns {string} The type of the question.
     */
    get questionType() {
        return this._questionType;
    }

    /**
     * Gets the tag name of the question box.
     * @returns {string} The tag name of the question box.
     */
    getBoxTag() {
        return this.constructor.getBoxTagName();
    }

    /**
     * Renders the answer.
     */
    render() {
        throw new Error("not implemented");
    }

    /**
     * Parses an XML element and returns a QuestionObj instance.
     * @param {Element} xmlElem - The XML element to parse.
     * @returns {QuestionObj} - The parsed QuestionObj instance.
     */
    parse(xmlElem) {
        throw new Error("not implemented");
    }

    /**
     * Answers the question automatically.
     * @returns {void}
     */
    doAnswer() {
        throw new Error("not implemented");
    }

    /**
     * Checks if the given question box is the correct one.
     * @param {Element} questionElement - The question box to check.
     * @returns {boolean} - True if the question box is correct, false otherwise.
     */
    isRightXMLQuestionElement(questionElement) {
        throw new Error("not implemented");
    }

    /**
     * Gets the tag name of the question box.
     * @returns {string} The tag name of the question box.
     */
    static getBoxTagName() {
        return undefined;
    }
}