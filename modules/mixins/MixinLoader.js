import { MixinXMLHttpRequest } from "./impl/MixinXMLHttpRequest.js";

export class MixinLoader {
    static mixins = [
        new MixinXMLHttpRequest()
    ];

    static load() {
        MixinLoader.mixins.forEach((mixin) => {
            mixin.load();
        });
    }
}