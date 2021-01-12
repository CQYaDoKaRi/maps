"use strict";
/**
 * アプリケーション
 */
class app {
    constructor() {
        this.SCRIPT = [];
    }
    /**
     * CSS読み込み
     * @param src ソースパス
     */
    css(src) {
        const head = document.getElementsByTagName("head")[0];
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = src;
        head.appendChild(link);
    }
    /**
     * JavaScript読み込み
     * @param src ソースパス
     */
    js(src) {
        const script = document.createElement("script");
        script.defer = true;
        script.src = src;
        script.onload = () => {
            if (this.SCRIPT.length > 0) {
                this.SCRIPT.shift();
            }
            if (this.SCRIPT.length > 0) {
                this.jsAdd(this.SCRIPT[0]);
            }
        };
        this.SCRIPT.push(script);
        if (this.SCRIPT.length === 1) {
            this.jsAdd(this.SCRIPT[0]);
        }
    }
    /**
     * JavaScript追加
     * @param script Script(JavaScript)オブジェクト
     */
    jsAdd(script) {
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}
