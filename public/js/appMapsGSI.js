"use strict";
/**
 * 地理院タイル
 */
class appMapsGSI {
    /**
     * constructor
     * @param oMaps
     */
    constructor(oMaps) {
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
    setDiv(o) {
        this.oDiv = o;
        this.oImg = [];
        this.oImgPos = [];
        this.n = 0;
    }
    /**
     * 設定：タイル
     * @param o タイル画像オブジェクト
     * @param pos タイル座標情報
     */
    setTile(o, pos) {
        this.oImg.push(o);
        this.oImgPos.push(pos);
    }
    /**
     * シンボル生成
     * @param w シンボル幅[px]
     * @param h シンボル高[px]
     */
    Symbol(w, h) {
        this.n++;
        if (this.oImg.length === this.n) {
            this.oImg.map((o, n, oImg) => {
                const vImgR = o.getBoundingClientRect();
                const vImgY = vImgR.top + window.pageYOffset;
                const vImgX = vImgR.left + window.pageXOffset;
                const oImgP = document.createElement("div");
                oImgP.innerHTML = "▲";
                oImgP.style.fontSize = "24px";
                oImgP.style.color = "#FF0000";
                oImgP.style.position = "absolute";
                oImgP.style.top = (vImgY + this.oImgPos[n].px_y - (w * 0.5)) + "px";
                oImgP.style.left = (vImgX + this.oImgPos[n].px_x - (h * 0.5)) + "px";
                if (this.oDiv) {
                    this.oDiv.append(oImgP);
                }
            });
        }
    }
}
