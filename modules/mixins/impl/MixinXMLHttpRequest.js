import { Settings } from "../../Settings.js";
import { Mixin } from "../Mixin.js";

export class MixinXMLHttpRequest extends Mixin {
    static agreedModifyScore = false;

    load() {
        const _XHR = XMLHttpRequest;

        XMLHttpRequest = new Proxy(_XHR, {
            construct: (target, args) => {
                let obj = new target(...args);

                let open = obj.open;
                obj.open = function (method, url, async, user, password) {
                    console.log(`XHR request: Method - ${method}, URL - ${url}`);
                    open.call(this, method, url, async, user, password);
                };

                let send = obj.send;
                obj.send = function (body) {
                    let params = new URLSearchParams(body);

                    // 受講時間を追加する
                    if (Settings.get("addLearningTime").checked) {
                        if (params.has('learning_time')) {
                            const learningTime = params.get("learning_time");

                            let min = parseFloat(Settings.get("learningTimeMinOffset").value);
                            let max = parseFloat(Settings.get("learningTimeMaxOffset").value);
                            
                            if (min > max) [min, max] = [max, min];
                            
                            let addTime = (Math.random() * (max - min) + min).toFixed(1);

                            if (confirm(`受講時間を${addTime}秒加算します。\nよろしいですか？`)) {
                                params.set('learning_time', `${(parseFloat(learningTime) + parseFloat(addTime)).toFixed(1)}`);
                            }
                        }
                    }
                    
                    if (Settings.get("modifyScore").checked) {
                        if (params.has('totalscore')) {
                            let scoreToModify = Settings.get("scoreToModify").value;

                            if (Number.isInteger(Number(scoreToModify))) {
                                if (MixinXMLHttpRequest.agreedModifyScore || confirm(`得点を${scoreToModify}点に変更します。\n本当によろしいですか？`)) {
                                    MixinXMLHttpRequest.agreedModifyScore = true;
                                    params.set('totalscore', scoreToModify);
                                } else {
                                    Settings.modify("modifyScore", "checked", false);
                                }
                            } else {
                                alert("入力された得点が不正です。操作をキャンセルします。");

                                Settings.modify("modifyScore", "checked", false);
                            }
                        }
                    }

                    /*
                    if (Settings.get("allCorrect").checked) {
                        // TODO: 全ての問題を正解にする
                        // %3Ccorrect%3Efalse%3C%2Fcorrect%3E to %3Ccorrect%3Efalse%3C%2Fcorrect%3E
                        if (params.has('answer') && confirm("問題を正解に変更します。\nよろしいですか？")) {
                            if (params.has('totalscore')) {
                                params.set('totalscore', '100');
                            }

                            // let answer = params.get('answer');
                            // answer = answer.replaceAll("%3Ccorrect%3Efalse%3C%2Fcorrect%3E", "%3Ccorrect%3Etrue%3C%2Fcorrect%3E");
                            // params.set('answer', answer);
                        }
                    }
                    */

                    body = params.toString();
                    console.log(`XHR request body: ${body}`);
                    send.call(this, body);
                };

                return obj;
            }
        });
    }

    /*
    intercept() {

        // Xhr hook
        var _open = XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (method, URL) {
            var _onreadystatechange = this.onreadystatechange,
                _this = this;

            _this.onreadystatechange = function () {
                
                try {
                    console.log(_this.responseText);
                    // rewrite responseText
                    // Object.defineProperty(_this, 'responseText', { value: newXmlStr });
                } catch (e) {
                    console.error('Error caught in xhr hook:', e);
                }

                console.log('Caught', method, URL);
                // call original callback
                if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
                
            };

            // detect any onreadystatechange changing
            Object.defineProperty(this, "onreadystatechange", {
                get: function () {
                    return _onreadystatechange;
                },
                set: function (value) {
                    _onreadystatechange = value;
                }
            });

            return _open.apply(_this, arguments);
        };
    }
    */
}