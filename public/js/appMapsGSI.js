"use strict";
/**
 * 地理院タイル
 */
var appMapsGSI = /** @class */ (function () {
    /**
     * constructor
     * @param oMaps
     */
    function appMapsGSI(oMaps) {
        this.oMaps = null;
        this.oDiv = null;
        this.oImg = [];
        this.oImgPos = [];
        this.n = 0;
        this.oMaps = oMaps;
    }
    /**
     * 設定：DIV
     * @param o Divオブジェクト
     */
    appMapsGSI.prototype.setDiv = function (o) {
        this.oDiv = o;
        this.oImg = [];
        this.oImgPos = [];
        this.n = 0;
    };
    /**
     * 設定：タイル
     * @param o タイル画像オブジェクト
     * @param pos タイル座標情報
     */
    appMapsGSI.prototype.setTile = function (o, pos) {
        this.oImg.push(o);
        this.oImgPos.push(pos);
    };
    /**
     * シンボル生成
     * @param w シンボル幅[px]
     * @param h シンボル高[px]
     */
    appMapsGSI.prototype.Symbol = function (w, h) {
        var _this = this;
        this.n++;
        if (this.oImg.length === this.n) {
            this.oImg.map(function (o, n, oImg) {
                var vImgR = o.getBoundingClientRect();
                var vImgY = vImgR.top + window.pageYOffset;
                var vImgX = vImgR.left + window.pageXOffset;
                var oImgP = document.createElement("div");
                oImgP.innerHTML = "▲";
                oImgP.style.fontSize = "24px";
                oImgP.style.color = "#FF0000";
                oImgP.style.position = "absolute";
                oImgP.style.top = (vImgY + _this.oImgPos[n].px_y - (w * 0.5)) + "px";
                oImgP.style.left = (vImgX + _this.oImgPos[n].px_x - (h * 0.5)) + "px";
                if (_this.oDiv) {
                    _this.oDiv.append(oImgP);
                }
            });
        }
    };
    return appMapsGSI;
}());
