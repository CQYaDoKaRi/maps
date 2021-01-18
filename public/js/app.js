"use strict";
/**
 * アプリケーション
 */
var app = /** @class */ (function () {
    function app() {
        this.SCRIPT = [];
        this._css = [];
        this._cssLib = [];
        this._js = [];
        this._jsLib = [];
    }
    /**
     * 取得：JavaScript
     * @returns ソースファイル名
     */
    app.prototype.getJs = function () {
        return this._js;
    };
    /**
     * 取得：JavaScript for lib
     * @returns ソースファイル名
     */
    app.prototype.getJsLib = function () {
        return this._jsLib;
    };
    /**
     * 取得：JavaScript
     * @returns ソースファイル名
     */
    app.prototype.getCss = function () {
        return this._css;
    };
    /**
     * 取得：JavaScript for lib
     * @returns ソースファイル名
     */
    app.prototype.getCssLib = function () {
        return this._cssLib;
    };
    /**
     * CSS読み込み
     * @param src ソースパス
     */
    app.prototype.css = function (src) {
        this._css.push(src);
        if (typeof document !== "undefined" && document) {
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = src;
            head.appendChild(link);
        }
    };
    /**
     * CSS読み込み for lib
     * @param src ソースパス
     */
    app.prototype.cssLib = function (src) {
        this._cssLib.push(src);
        this.css(src);
    };
    /**
     * JavaScript読み込み
     * @param src ソースパス
     */
    app.prototype.js = function (src) {
        var _this = this;
        this._js.push(src);
        if (typeof document !== "undefined" && document) {
            var script = document.createElement("script");
            script.defer = true;
            script.src = src;
            script.onload = function () {
                if (_this.SCRIPT.length > 0) {
                    _this.SCRIPT.shift();
                }
                if (_this.SCRIPT.length > 0) {
                    _this.jsAdd(_this.SCRIPT[0]);
                }
            };
            this.SCRIPT.push(script);
            if (this.SCRIPT.length === 1) {
                this.jsAdd(this.SCRIPT[0]);
            }
        }
    };
    /**
     * JavaScript読み込み for lib
     * @param src ソースパス
     */
    app.prototype.jsLib = function (src) {
        this._jsLib.push(src);
        this.js(src);
    };
    /**
     * JavaScript追加
     * @param script Script(JavaScript)オブジェクト
     */
    app.prototype.jsAdd = function (script) {
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    /**
     * include
     */
    app.prototype.include = function () {
        this.includeCss();
        this.includeJs();
    };
    /**
     * include CSS
     */
    app.prototype.includeCss = function () {
        this.cssLib("lib/leaflet.css");
        this.cssLib("lib/leaflet.awesome-markers.css");
        this.cssLib("https://use.fontawesome.com/releases/v5.0.13/css/all.css");
    };
    /**
     * include JavaScript
     */
    app.prototype.includeJs = function () {
        this.jsLib("lib/leaflet.js");
        this.jsLib("lib/leaflet.awesome-markers.js");
        this.jsLib("lib/chart.js");
        this.js("js/appMapsGSI.js");
        this.js("js/maps.js");
        this.js("js/mapsGpxChart.js");
        this.js("js/appMap.js");
        this.js("js/mapsDataPrefCapital.js");
        this.js("js/index.js");
    };
    return app;
}());
if (typeof module !== "undefined" && module && module.exports) {
    module.exports.app = app;
}
else {
    (function () {
        var fDev = false;
        // 引数処理
        var params = location.search.substring(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var v = params[i];
            var n = v.search(/=/);
            var key = n !== -1 ? v.slice(0, n).toLocaleLowerCase() : "";
            var val = decodeURI(v.slice(v.indexOf("=", 0) + 1));
            if (key) {
                // 開発モード：minify あり / なし
                if (key === "dev" && val === "1") {
                    fDev = true;
                }
            }
        }
        if (fDev) {
            var oApp = new app();
            oApp.include();
            console.log("\u001b[31m開発モード\u001b[30m");
        }
        else {
            var oApp = new app();
            oApp.includeCss();
            oApp.js("js/index.min.js");
        }
    })();
}
