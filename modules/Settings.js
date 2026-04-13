import { SettingObj } from "./SettingObj.js";

export class Settings {
    /**
     * default settings objects
     * @type {SettingObj}
     */
    static settings = [
        // 放置してもlearningTimeのカウントが止まらないようにするかどうか
        new SettingObj('noLearningTimeTimeout', 'checkbox', null, true),
        // 問題ページを開いたら自動で解答するかどうか
        new SettingObj('answerAutomatically', 'checkbox', null, false),
        // 自動提出をするかどうか
        new SettingObj('submitAutomatically', 'checkbox', null, false),
        // 自動提出する場合の提出までの時間の最小値(秒)（30以上）
        new SettingObj('submitLimitMinTime', 'text', "60"),
        // 自動提出する場合の提出までの時間の最大値(秒)
        new SettingObj('submitLimitMaxTime', 'text', "240"),
        // 受講時間をたすかどうか
        new SettingObj('addLearningTime', 'checkbox', null, false),
        // 受講時間をたす場合の最小値（秒)
        new SettingObj('learningTimeMinOffset', 'text', "0"),
        // 受講時間をたす場合の最大値(秒)
        new SettingObj('learningTimeMaxOffset', 'text', "60"),
        // TODO: 全て正答に改竄するかどうか
        // new SettingObj('allCorrect', 'checkbox', null, false),
        // TODO: 解説を表示するかどうか
        // new SettingObj('showExplanation', 'checkbox', null, true),
        // 得点を改竄する
        new SettingObj('modifyScore', 'checkbox', null, false),
        // 改竄する得点
        new SettingObj('scoreToModify', 'text', "100")
    ];

    /**
    * default setting name map
    * @type {Object.<string, string>}
    */
    static settingNameMap = {
        'noLearningTimeTimeout': '放置中に学習時間のカウントをタイムアウトさせない',
        'answerAutomatically': '問題ページを開いたら自動で解答する',
        'submitAutomatically': '自動提出する',
        'submitLimitMinTime': '自動提出までの最小時間(秒)（30以上）',
        'submitLimitMaxTime': '自動提出までの最大時間(秒)',
        'addLearningTime': '1問当たりの受講時間を加算する（非推奨）',
        'learningTimeMinOffset': '加算する受講時間の最小値(秒)',
        'learningTimeMaxOffset': '加算する受講時間の最大値(秒)',
        // 'allCorrect': '提出時に全ての問題を正解に改竄する（非推奨）',
        // 'showExplanation': '提出後に解説を表示する（β）',
        'modifyScore': '得点を改竄する（非推奨）',
        'scoreToModify': '改竄する得点'
    };

    /**
     * Retrieves the setting with the specified name.
     * @param {string} name - The name of the setting to retrieve.
     * @returns {SettingObj|undefined} - The setting object if found, or undefined if not found.
     */
    static get(name) {
        return Settings.settings.find((s) => s.name === name);
    }


    /**
     * Modifies a setting by updating the specified member with the given value.
     * If update is true, it also updates the DOM element with the new value.
     * @param {string} name - The name of the setting to modify.
     * @param {string} member - The member of the setting to update.
     * @param {any} value - The new value to assign to the member.
     * @param {boolean} [update=true] - Optional. Specifies whether to write the settings to the document (to save).
     */
    static modify(name, member, value, update = true) {
        for (let i = 0; i < Settings.settings.length; i++) {
            const s = Settings.settings[i];
            if (s.name === name) {
                s[member] = value;
                document.getElementById(s.name)[member] = value; // domにも反映
                Settings.settings[i] = s;

                break;
            }
        }

        if (update) Settings.updateSettings();
    }

    /**
     * Updates the settings and write in the document (to save).
     */
    static updateSettings() {
        const settingv = document.getElementById("sae-setting");
        settingv.innerText = JSON.stringify(Settings.settings);
    }
}