export class AnswerXmlRetriever {
    constructor() {
    }

    set auToken(auToken) {
        this._auToken = auToken;
    }

    get auToken() {
        return this._auToken;
    }

    set cfcMethod(cfcMethod) {
        this._cfcMethod = cfcMethod;
    }

    get cfcMethod() {
        return this._cfcMethod;
    }

    isValueSet() {
        return this.auToken !== undefined && this.cfcMethod !== undefined;
    }

    get answerXmlUrl() {
        const xmlUrl = window.playerModel.get_xml_url;
        return `${xmlUrl}?method=${this.cfcMethod}&au_token=${this.auToken}`;
    }

    static retrieveAuToken() {
        for (; ; ) {
            try {
                if (window.playerModel.au_token !== undefined) {
                    return window.playerModel.au_token;
                }
            } catch (ignored) {
            }
        }
    }

    static retrieveCfcMethod() {
        for (; ; ) {
            try {
                if (window.playerModel.cfc_method !== undefined) {
                    return window.playerModel.cfc_method;
                }
            } catch (ignored) {
            }
        }
    }
}