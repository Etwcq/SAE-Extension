export class SettingObj {
    /**
     * Represents a setting object.
     * @constructor
     * @param {string} name - The title of the setting.
     * @param {string} inputType - The type of input for the setting.
     * @param {string} [value=null] - The initial value of the setting.
     * @param {boolean} [checked=null] - The initial checked state of the setting.
     */
    constructor(name, inputType, value = null, checked = null) {
        this.name = name;
        this.inputType = inputType;
        this.value = value;
        this.checked = checked;
    }
}