"use strict";
// npm install --save @types/geojson
/// <reference path="../../node_modules/@types/geojson/index.d.ts" />
// npm install --save @types/leaflet
/// <reference path="../../node_modules/@types/leaflet/index.d.ts" />
// npm install --save @types/leaflet.awesome-markers
/// <reference path="../../node_modules/@types/leaflet.awesome-markers/index.d.ts" />
/**
 * アプリケーション：地図
 */
class appMap {
    constructor(i, lat, lon, z, options) {
        this.oMap = null;
        this.iMapApp = "";
        this.lat = 0;
        this.lon = 0;
        this.z = 0;
        this.options = {};
        this.iMapApp = i;
        this.oMapApp = document.getElementById(this.iMapApp);
        if (!this.oMapApp) {
            return;
        }
        this.oMap = L.map(this.iMapApp);
        this.lat = lat;
        this.lon = lon;
        this.z = z;
        this.options = options;
        if (this.options.w) {
            this.oMapApp.style.width = this.options.w + this.options.wUnit;
        }
        if (this.options.h) {
            this.oMapApp.style.height = this.options.h + this.options.hUnit;
        }
        L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
            attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>GSI</a>"
        }).addTo(this.oMap);
        this.view(this.lat, this.lon, this.z);
    }
    /**
     * 表示
     * @param lat 緯度
     * @param lon 経度
     * @param z ズームレベル
     */
    view(lat, lon, z) {
        if (!this.oMap) {
            return;
        }
        this.oMap.setView([lat, lon], z);
    }
    /**
     * リサイズ
     * @param w 幅[px]
     * @param h 高[px]
     */
    resize(w, h) {
        if (this.oMapApp) {
            this.oMapApp.style.width = this.options.w + "px";
            this.oMapApp.style.height = this.options.h + "px";
        }
    }
    /**
     * ポイント
     * @param lat 緯度
     * @param lon 経度
     * @param options オプション
     */
    point(lat, lon, options) {
        if (!this.oMap) {
            return;
        }
        if (!options.color) {
            options.color = "bule";
        }
        const _options = {
            prefix: "glyphicon",
            icon: "lock",
            markerColor: options.color,
            extraClasses: "glyphicons-custom"
        };
        const o = L.marker([lat, lon], { icon: L.AwesomeMarkers.icon(options) }).addTo(this.oMap);
        if (options.popup) {
            o.bindPopup(options.popup);
        }
    }
    /**
     * アーク
     * @param coordinates 座標
     * @param options オプション
     */
    arc(coordinates, options) {
        if (!this.oMap) {
            return;
        }
        if (!options.color) {
            options.color = "bule";
        }
        const o = L.polyline(coordinates, { color: options.color }).addTo(this.oMap);
        if (options.popup) {
            o.bindPopup(options.popup);
        }
    }
}
