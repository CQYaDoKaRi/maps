"use strict";
/**
 * 地図：種別：２地点間の距離の計算種類
 */
var mapsTypeDistance;
(function (mapsTypeDistance) {
    // 球面三角法
    mapsTypeDistance[mapsTypeDistance["SphericalTrigonometry"] = 0] = "SphericalTrigonometry";
    mapsTypeDistance[mapsTypeDistance["Hubeny"] = 1] = "Hubeny";
    mapsTypeDistance[mapsTypeDistance["GeodesicSailing"] = 2] = "GeodesicSailing";
})(mapsTypeDistance || (mapsTypeDistance = {}));
/**
 * 地図：種別：タイル
 */
var mapsTypeTile;
(function (mapsTypeTile) {
    mapsTypeTile[mapsTypeTile["TXT"] = 0] = "TXT";
    mapsTypeTile[mapsTypeTile["PNG"] = 1] = "PNG";
})(mapsTypeTile || (mapsTypeTile = {}));
/**
 * 地図：座標
 */
class mapsLatLon {
    constructor() {
        /**
         * 緯度
         */
        this.lat = 0.0;
        /**
         * 経度
         */
        this.lon = 0.0;
    }
}
/**
 * 地図：タイル
 */
class mapsTile {
    constructor() {
        /**
         * タイル座標X
         */
        this.x = 0;
        /**
         * タイル座標Y
         */
        this.y = 0;
        /**
         * タイル座標Z
         */
        this.z = 0;
        /**
         * タイル内座標X[pixel]
         */
        this.px_x = 0;
        /**
         * タイル内座標Y[pixel]
         */
        this.px_y = 0;
    }
}
/**
 * 地図：タイル：URL
 */
class mapsTileUrl {
    constructor() {
        /**
         * タイル座標
         */
        this.tile = null;
        /**
         * タイルURL
         */
        this.url = "";
        /**
         * タイル種別
         */
        this.type = "";
        /**
         * タイル拡張子
         */
        this.ext = "";
    }
    /**
     * 設定
     * @param x タイル座標X
     * @param y タイル座標Y
     * @param z タイル座標Z
     * @param url URL( / で終わること)
     * @param type 種別
     * @param ext 拡張子
     */
    set(x, y, z, url, type, ext) {
        this.tile = new mapsTile();
        this.tile.x = x;
        this.tile.y = y;
        this.tile.z = z;
        this.setUrl(url, type, ext);
    }
    /**
     * 設定：タイル
     * @param tile タイル座標
     * @param url URL( / で終わること)
     * @param type 種別
     * @param ext 拡張子
     */
    setTile(tile, url, type, ext) {
        this.tile = tile;
        this.setUrl(url, type, ext);
    }
    /**
     * 設定：URL
     * @param url URL( / で終わること)
     * @param type 種別
     * @param ext 拡張子
     */
    setUrl(url, type, ext) {
        if (!this.tile) {
            return;
        }
        this.type = type;
        this.ext = ext;
        this.url = url + this.type + "/" + this.tile.z + "/" + this.tile.x + "/" + this.tile.y + "." + this.ext;
    }
}
/**
 * 地図：タイル：標高タイル
 */
class mapsTileDem {
    /**
     * constructor
     * @param tile タイル情報
     * @param url タイルURL
     * @param t タイル種別
     * @param e 標高(m)
     */
    constructor(tile, t, url, data, e) {
        /**
         * タイル種別
         */
        this.t = mapsTypeTile.TXT;
        /**
         * タイルURL
         */
        this.url = "";
        /**
         * 標高データ
         */
        this.dem = [];
        /**
         * 標高データ（文字列配列）
         */
        this.demTxt = [];
        /**
         * タイル情報
         */
        this.tile = null;
        /**
         * 標高（m）
         */
        this.e = 0;
        this.tile = tile;
        this.t = t;
        this.url = url;
        if (t == mapsTypeTile.TXT) {
            this.dem = [];
            this.demTxt = data;
        }
        else if (t == mapsTypeTile.PNG) {
            this.dem = data;
            this.demTxt = [];
        }
        this.e = e;
    }
    /**
     * 標高データ取得
     * @returns 標高データ配列
     */
    getDem() {
        let ret = [];
        if (this.t == mapsTypeTile.TXT) {
            if (this.dem.length === 0) {
                this.dem = Array(this.demTxt.length);
                this.demTxt.map((dem, n, demTxt) => {
                    this.dem[n] = NaN;
                    if (/^[+,-]?([1-9]\d*|0)(\.\d+)?$/.test(dem)) {
                        this.dem[n] = parseFloat(dem);
                    }
                });
            }
        }
        else if (this.t == mapsTypeTile.PNG) {
            ret = this.dem;
        }
        return ret;
    }
}
/**
 * 地図：データ：Garmin GPSログ(GPX)
 */
class mapsDataGpx {
    /**
     * constructor
     * @param src ファイル名
     * @param data GPSログ（GPX）
     */
    constructor(src, data) {
        /**
         * ファイル名
         */
        this.src = "";
        /**
         * XML
         */
        this.xml = null;
        /**
         * タイトル
         */
        this.name = "";
        /**
         * ログ
         */
        this.logs = [];
        /**
         * ログ：時間
         */
        this.logsTMS = 0;
        /**
         * ログ：範囲：緯度（南）
         */
        this.logsBoundsS = 90.0;
        /**
         * ログ：範囲：緯度（北）
         */
        this.logsBoundsN = -90.0;
        /**
         * ログ：範囲：経度（東）
         */
        this.logsBoundsE = -180.0;
        /**
         * ログ：範囲：経度（西）
         */
        this.logsBoundsW = 180.0;
        this.src = src;
        if (data !== null && typeof data === "string") {
            this.xml = new DOMParser().parseFromString(data, "text/xml");
            this.read(this.xml);
            this.logs.map((log, n, logs) => {
                if (this.logsBoundsS > log.lat) {
                    this.logsBoundsS = log.lat;
                }
                if (this.logsBoundsN < log.lat) {
                    this.logsBoundsN = log.lat;
                }
                if (this.logsBoundsE < log.lon) {
                    this.logsBoundsE = log.lon;
                }
                if (this.logsBoundsW > log.lon) {
                    this.logsBoundsW = log.lon;
                }
            });
        }
    }
    /**
     * 読み込み
     * @param node データ
     */
    read(node) {
        if (this.xml !== null) {
            let n = 0;
            if (node.nodeName === "name") {
                this.name = node.textContent;
            }
            else if (node.nodeName === "trkseg") {
                const oMap = new maps();
                let distance = 0;
                for (n = 0; n < node.childNodes.length; n++) {
                    const nodeLogs = node.childNodes[n];
                    if (nodeLogs.nodeName === "trkpt") {
                        const nodeLogsTrkpt = nodeLogs.attributes;
                        if (typeof nodeLogsTrkpt["lat"] === "object" && typeof nodeLogsTrkpt["lon"] === "object") {
                            const trkpt = new mapsDataGpxLog(parseFloat(nodeLogsTrkpt.lat.value), parseFloat(nodeLogsTrkpt.lon.value));
                            for (let nn = 0; nn < nodeLogs.childNodes.length; nn++) {
                                const nodeLogsInfo = nodeLogs.childNodes[nn];
                                if (nodeLogsInfo.childNodes.length > 0) {
                                    const nodeLogsInfoData = nodeLogsInfo.childNodes[0];
                                    if (nodeLogsInfo.nodeName === "time") {
                                        trkpt.time = new Date(nodeLogsInfoData.nodeValue);
                                        const time_year = "" + trkpt.time.getFullYear();
                                        const time_month = ("0" + trkpt.time.getMonth()).slice(-2);
                                        const time_day = ("0" + trkpt.time.getDate()).slice(-2);
                                        const time_hour = ("0" + trkpt.time.getHours()).slice(-2);
                                        const time_minute = ("0" + trkpt.time.getMinutes()).slice(-2);
                                        const time_second = ("0" + trkpt.time.getSeconds()).slice(-2);
                                        trkpt.timeFormatJP = time_year + "年" + time_month + "月" + time_day + "日 " + time_hour + "時" + time_minute + "分" + time_second + "秒";
                                    }
                                    else if (nodeLogsInfo.nodeName === "ele") {
                                        trkpt.e = parseFloat(nodeLogsInfoData.nodeValue);
                                    }
                                }
                            }
                            this.logs.push(trkpt);
                            if (this.logs.length > 1) {
                                n = this.logs.length - 1;
                                const logN = this.logs[n];
                                const logP = this.logs[n - 1];
                                if (logN.time && logP.time) {
                                    let tm = Math.ceil((logN.time.getTime() - logP.time.getTime()) / 1000);
                                    if (this.logsTMS < tm) {
                                        if (tm > 60) {
                                            tm = 60;
                                        }
                                        this.logsTMS = tm;
                                    }
                                }
                                // 距離
                                distance += oMap.distanceH(logN.lat, logN.lon, logP.lat, logP.lon);
                                logN.distance = distance;
                                if (logN.distance >= 1000) {
                                    logN.distanceText = (logN.distance / 1000).toLocaleString() + " km";
                                }
                                else {
                                    logN.distanceText = logN.distance.toLocaleString() + " m";
                                }
                                // 角度
                                logN.direction = Math.abs(Math.ceil(oMap.direction(logN.lat, logN.lon, logP.lat, logP.lon) * 100) / 100);
                                logN.directionName = oMap.deg2Name(logN.direction);
                                // 勾配
                                logN.incline = logN.e / distance;
                                logN.incline = Math.ceil(logN.incline * 100) / 100;
                                // 速度
                                const _distance = Math.abs(logN.distance - logP.distance) / 1000;
                                if (logN.time && logP.time) {
                                    let _time = Math.ceil((logN.time.getTime() - logP.time.getTime()) / 1000);
                                    if (_time > 0) {
                                        _time = _time / 60 / 60; // h
                                    }
                                    if (_distance > 0 && _time > 0) {
                                        logN.speed = Math.ceil(_distance / _time * 100) / 100;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (n = 0; n < node.childNodes.length; n++) {
                this.read(node.childNodes[n]);
            }
        }
    }
    /**
     * 名前
     */
    getName() {
        return this.name;
    }
    /**
     * ログ
     */
    getLogs() {
        return this.logs;
    }
    /**
     * ログ
     */
    getlogsTMS() {
        return this.logsTMS;
    }
}
/**
 * 地図：データ：Garmin GPSログ(GPX)：ログ
 */
class mapsDataGpxLog {
    /**
     * constructor
     * @param lat 緯度
     * @param lon 経度
     */
    constructor(lat, lon) {
        /**
         * 時刻
         */
        this.time = null;
        /**
         * 時刻 -> 年月日日時秒
         */
        this.timeFormatJP = "";
        /**
         * 緯度
         */
        this.lat = 0.0;
        /**
         * 経度
         */
        this.lon = 0.0;
        /**
         * 標高(m)
         */
        this.e = 0;
        /**
         * 距離(m)
         */
        this.distance = 0;
        /**
         * 距離(m, km)（表示用）
         */
        this.distanceText = "";
        /**
         * 角度
         */
        this.direction = 0;
        /**
         * 方位
         */
        this.directionName = "";
        /**
         * 勾配
         */
        this.incline = 0;
        /**
         * 速度（時速）
         */
        this.speed = 0;
        this.lat = lat;
        this.lon = lon;
    }
}
/**
 * 地図
 */
class maps {
    /**
     * constructor
     */
    constructor() {
        /**
         * 楕円体
         */
        this.EARTH = {
            /**
             * 赤道半径
             */
            A: 6378137.0
            /**
             * 赤道半径
             */
            ,
            Aja: 6377397.155
            /**
             * 極半径
             */
            ,
            B: 6356752.314140356
            /**
             * 極半径
             */
            ,
            Bja: 6356078.963
            // = this.EARTH["B"] / this.EARTH["A"]
            /**
             * 極半径 / 赤道半径
             */
            ,
            BdivA: 0.9966471893188177
            /**
             * 極半径 / 赤道半径
             */
            ,
            BdivAja: 0.9966572268463341
            // = (this.EARTH["A"] - this.EARTH["B"]) / this.EARTH["A"];
            /**
             * 扁平率
             */
            ,
            F: 0.0033528106811822724
            /**
             * 扁平率
             */
            ,
            Fja: 0.0033427731536659813
            // = (this.EARTH["A"] * this.EARTH["A"] - this.EARTH["B"] * this.EARTH["B"]) / (this.EARTH["A"] * this.EARTH["A"]);
            /**
             * 第一離心率^2
             */
            ,
            E2: 0.00669438002301188
            /**
             * 第一離心率^2
             */
            ,
            E2ja: 0.00667436061028297
            // = this.EARTH["A"] * (1 - this.EARTH["E2"]);
            /**
             * 赤道上の子午線曲率半径
             */
            ,
            A1E2: 6335439.32708317
            /**
             * 赤道上の子午線曲率半径
             */
            ,
            A1E2ja: 6334832.10663254
        };
        // 楕円体タイプ
        // ""   : GSR80
        // "ja" : Bessel（日本測地系）
        this.EARTH_LOCALE = "";
        /**
         * タイル
         */
        this.TILE = {
            /**
             * タイルサイズ[px]
             */
            SIZE: 256
            /**
             * 赤道直径（ズームレベル０の横幅）
             */
            ,
            A: 40000000
            /**
             * inch → meter
             */
            ,
            unitI2M: 0.0254
            /**
             * 標高タイル用
             */
            ,
            pow2_8: Math.pow(2, 8),
            pow2_16: Math.pow(2, 16),
            pow2_23: Math.pow(2, 23),
            pow2_24: Math.pow(2, 24)
        };
        /**
         * タイル：標高メッシュ
         */
        this.TILE_DEM = { Scale8: null, Scale9: null /*, Scale10: null */ };
        /**
         * タイル：標高タイルURL
         */
        this.TILE_DEM_URL = {};
    }
    /**
     * 逆双曲線正弦
     * @param x radian
     * @returns
     */
    asinh(x) {
        return Math.log(x + Math.sqrt(x * x + 1.0));
    }
    /**
     * 逆双曲線余弦
     * @param x radian
     * @returns
     */
    acosh(x) {
        return Math.log(x + Math.sqrt(x * x - 1.0));
    }
    /**
     * 逆双曲線正接
     * @param x radian
     * @returns radian
     */
    atanh(x) {
        return 0.5 * Math.log((1.0 + x) / (1.0 - x));
    }
    /**
     * 逆双曲線余割
     * @param x radian
     * @returns radian
     */
    acsch(x) {
        return this.asinh(1 / x);
    }
    /**
     * 逆双曲線正割
     * @param x radian
     * @returns radian
     */
    asech(x) {
        return this.acosh(1 / x);
    }
    /**
     * 逆双曲線余接
     * @param x radian
     * @returns radian
     */
    acoth(x) {
        return this.atanh(1 / x);
    }
    /**
     * 度(degree)をradianに変換
     * @param deg degree
     * @return radian
     */
    deg2rad(deg) {
        return deg / 180 * Math.PI;
    }
    /**
     * radianを度(degree)に変換
     * @param rad radian
     * @return degree
     */
    rad2deg(rad) {
        return rad * 180 / Math.PI;
    }
    /**
     * 方位角を方位名(略字)に変換
     * @param deg degree
     * @returns 方位名
     */
    deg2Name(deg) {
        let ret = "N";
        deg = Math.abs(deg);
        const d = 22.5 / 2;
        for (let n = 0, _deg = d; _deg !== 360; _deg += d, n++) {
            if (deg < _deg) {
                if (n === 0) {
                    ret = "N";
                }
                else if (n === 1) {
                    ret = "NNE";
                }
                else if (n === 2) {
                    ret = "NE";
                }
                else if (n === 3) {
                    ret = "ENE";
                }
                else if (n === 4) {
                    ret = "E";
                }
                else if (n === 5) {
                    ret = "ESE";
                }
                else if (n === 6) {
                    ret = "SE";
                }
                else if (n === 7) {
                    ret = "SSE";
                }
                else if (n === 8) {
                    ret = "S";
                }
                else if (n === 9) {
                    ret = "SSW";
                }
                else if (n === 10) {
                    ret = "SW";
                }
                else if (n === 11) {
                    ret = "WSW";
                }
                else if (n === 12) {
                    ret = "E";
                }
                else if (n === 13) {
                    ret = "ENE";
                }
                else if (n === 14) {
                    ret = "NE";
                }
                else if (n === 15) {
                    ret = "NNE";
                }
                break;
            }
        }
        return ret;
    }
    /**
     * 楕円体モデル
     * @param t "ja"=日本測地系, else=GSR80
     */
    Locale(t) {
        if (t === "ja") {
            this.EARTH_LOCALE = t;
        }
        else {
            this.EARTH_LOCALE = "";
        }
    }
    /**
     * 日本測地系→世界測地系：1次式（Google maps）
     * @param lat 緯度
     * @param lon 経度
     * @returns 緯度経度
     */
    tky2jgdG(lat, lon) {
        const ret = {
            lat: 0,
            lon: 0
        };
        ret.lat = lat - lat * 0.00010695 + lon * 0.000017464 + 0.0046017;
        ret.lon = lon - lat * 0.000046038 - lon * 0.000083043 + 0.01004;
        return ret;
    }
    /**
     * 世界測地系→日本測地系：1次式（Google maps）
     * @param lat 緯度
     * @param lon 経度
     * @returns 緯度経度
     */
    jgd2tkyG(lat, lon) {
        const ret = {
            lat: 0,
            lon: 0
        };
        ret.lat = lat + 0.000106961 * lat - 0.000017467 * lon - 0.004602017;
        ret.lon = lon + 0.000046047 * lat + 0.000083049 * lon - 0.010041046;
        return ret;
    }
    /**
     * ２地点間の距離（球面三角法）
     * @param lat1 緯度１
     * @param lon1 経度１
     * @param lat2 緯度２
     * @param lon2 経度２
     * @returns 距離(m)
     */
    distanceT(lat1, lon1, lat2, lon2) {
        return this.distance(mapsTypeDistance.SphericalTrigonometry, lat1, lon1, lat2, lon2);
    }
    /**
     * ２地点間の距離（ヒュベニ）
     * @param lat1 緯度１
     * @param lon1 経度１
     * @param lat2 緯度２
     * @param lon2 経度２
     * @returns 距離(m)
     */
    distanceH(lat1, lon1, lat2, lon2) {
        return this.distance(mapsTypeDistance.Hubeny, lat1, lon1, lat2, lon2);
    }
    /**
     * ２地点間の距離（測地線航海算法）
     * @param lat1 緯度１
     * @param lon1 経度１
     * @param lat2 緯度２
     * @param lon2 経度２
     * @returns 距離(m)
     */
    distanceS(lat1, lon1, lat2, lon2) {
        return this.distance(mapsTypeDistance.GeodesicSailing, lat1, lon1, lat2, lon2);
    }
    /**
     * ２地点間の距離
     * @param type 計算方法
     * @param lat1 緯度１
     * @param lon1 経度１
     * @param lat2 緯度２
     * @param lon2 経度２
     * @return 距離(m)
     */
    distance(type, lat1, lon1, lat2, lon2) {
        let ret = 0;
        const A = this.EARTH["A" + this.EARTH_LOCALE];
        const BdivA = this.EARTH["BdivA" + this.EARTH_LOCALE];
        const F = this.EARTH["F" + this.EARTH_LOCALE];
        const E2 = this.EARTH["E2" + this.EARTH_LOCALE];
        const A1E2 = this.EARTH["A1E2" + this.EARTH_LOCALE];
        lat1 = this.deg2rad(lat1);
        lon1 = this.deg2rad(lon1);
        lat2 = this.deg2rad(lat2);
        lon2 = this.deg2rad(lon2);
        let lat = lat1 - lat2;
        let lon = lon1 - lon2;
        // 球面三角法
        // https://ja.wikipedia.org/wiki/%E7%90%83%E9%9D%A2%E4%B8%89%E8%A7%92%E6%B3%95
        if (type === mapsTypeDistance.SphericalTrigonometry) {
            lat /= 2;
            lon /= 2;
            ret = A * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(lat), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lon), 2)));
            //ret = A * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1) + Math.sin(lat1) * Math.sin(lat2));
        }
        // ヒュベニ
        else if (type === mapsTypeDistance.Hubeny) {
            const latAvg = (lat1 + lat2) / 2.0;
            const latSin = Math.sin(latAvg);
            const W = 1.0 - E2 * (latSin * latSin);
            // 子午線曲率半径(m)
            const M = A1E2 / (Math.sqrt(W) * W);
            // 卯酉線曲率半径
            const N = A / Math.sqrt(W);
            lat = M * lat;
            lon = N * Math.cos(latAvg) * lon;
            return Math.sqrt((lat * lat) + (lon * lon));
        }
        // 測地線航海算法
        else if (type === mapsTypeDistance.GeodesicSailing) {
            const p1 = Math.atan(BdivA) * Math.tan(lat1);
            const p2 = Math.atan(BdivA) * Math.tan(lat2);
            const sd = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(lon));
            const sdCos = Math.cos(sd / 2);
            const sdSin = Math.sin(sd / 2);
            const c = (Math.sin(sd) - sd) * Math.pow(Math.sin(p1) + Math.sin(p2), 2) / sdCos / sdCos;
            const s = (Math.sin(sd) + sd) * Math.pow(Math.sin(p1) - Math.sin(p2), 2) / sdSin / sdSin;
            const delta = F / 8.0 * (c - s);
            ret = A * (sd + delta);
        }
        return ret;
    }
    /**
     * 角度・距離から地点を求める
     * @param lat 緯度
     * @param lon 経度
     * @param a 角度
     * @param len 距離(m)
     * @return 緯度経度
     */
    distanceTo(lat, lon, a, len) {
        const ret = {
            lat: 0,
            lon: 0
        };
        const A = this.EARTH["A" + this.EARTH_LOCALE];
        const B = this.EARTH["B" + this.EARTH_LOCALE];
        const F = this.EARTH["F" + this.EARTH_LOCALE];
        lat = this.deg2rad(lat);
        lon = this.deg2rad(lon);
        a = this.deg2rad(a);
        const u1 = Math.atan((1 - F) * Math.tan(lat));
        const s1 = Math.atan(Math.tan(u1) / Math.cos(a));
        const ua = Math.asin(Math.cos(u1) * Math.sin(a));
        const u2 = Math.pow(Math.cos(ua), 2) * (Math.pow(A, 2) - Math.pow(B, 2)) / Math.pow(B, 2);
        const u2A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
        const u2B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
        let s = len / B / u2A;
        let ss;
        let x;
        let y;
        let _s;
        do {
            _s = s;
            ss = 2 * s1 + s;
            x = Math.cos(s) * (-1 + 2 * Math.pow(Math.cos(ss), 2)) - u2B / 6 * Math.cos(ss) * (-3 + 4 * Math.pow(Math.sin(ss), 2)) * (-3 + 4 * Math.pow(Math.cos(ss), 2));
            s = len / B / u2A + (u2B * Math.sin(s) * (Math.cos(ss) + u2B / 4 * x));
        } while (Math.abs(_s - s) > 1e-9);
        x = Math.sin(u1) * Math.cos(s) + Math.cos(u1) * Math.sin(s) * Math.cos(a);
        y = (1 - F) * Math.pow(Math.pow(Math.sin(ua), 2) + Math.pow(Math.sin(u1) * Math.sin(s) - Math.cos(u1) * Math.cos(s) * Math.cos(a), 2), 0.5);
        const l = Math.atan(Math.sin(s) * Math.sin(a) / (Math.cos(u1) * Math.cos(s) - Math.sin(u1) * Math.sin(s) * Math.cos(a)));
        const c = (F / 16) * Math.pow(Math.cos(ua), 2) * (4 + F * (4 - 3 * Math.pow(Math.cos(ua), 2)));
        const z = Math.cos(ss) + c * Math.cos(s) * (-1 + 2 * Math.pow(Math.cos(ss), 2));
        const lonTo = l - (1 - c) * F * Math.sin(ua) * (s + c * Math.sin(s) * z);
        ret.lat = this.rad2deg(Math.atan(x / y));
        ret.lon = this.rad2deg(lon + lonTo);
        return ret;
    }
    /**
     * ２地点間の角度
     * @param lat1 緯度１
     * @param lon1 経度１
     * @param lat2 緯度２
     * @param lon2 経度２
     * @return 角度
     */
    direction(lat1, lon1, lat2, lon2) {
        //https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
        //https://en.wikipedia.org/wiki/Vincenty%27s_formulae
        const F = this.EARTH["F" + this.EARTH_LOCALE];
        lat1 = this.deg2rad(lat1);
        lon1 = this.deg2rad(lon1);
        lat2 = this.deg2rad(lat2);
        lon2 = this.deg2rad(lon2);
        const lond = lon2 - lon1;
        const u1Tan = (1 - F) * Math.tan(lat1), cosU1 = 1 / Math.sqrt((1 + u1Tan * u1Tan));
        const u2Tan = (1 - F) * Math.tan(lat2), cosU2 = 1 / Math.sqrt((1 + u2Tan * u2Tan));
        const u1Sin = u1Tan * cosU1;
        const u2Sin = u2Tan * cosU2;
        let s;
        let sSin;
        let sCos;
        let _s = lond;
        let _s2;
        let _s2Sin;
        let _s2Cos;
        let _aTan2;
        let _aSin;
        let _aCos;
        let _aCosU;
        let _c;
        let _n = 0;
        do {
            sSin = Math.sin(_s);
            sCos = Math.cos(_s);
            _s2 = (cosU2 * sSin) * (cosU2 * sSin) + (cosU1 * u2Sin - u1Sin * cosU2 * sCos) * (cosU1 * u2Sin - u1Sin * cosU2 * sCos);
            if (_s2 < 0) {
                return 0;
            }
            _s2Sin = Math.sqrt(_s2);
            _s2Cos = u1Sin * u2Sin + cosU1 * cosU2 * sCos;
            _aTan2 = Math.atan2(_s2Sin, _s2Cos);
            _aSin = cosU1 * cosU2 * sSin / _s2Sin;
            _aCos = 1 - _aSin * _aSin;
            _aCosU = _s2Cos - 2 * u1Sin * u2Sin / _aCos;
            if (isNaN(_aCosU)) {
                _aCosU = 0;
            }
            _c = F / 16 * _aCos * (4 + F * (4 - 3 * _aCos));
            s = _s;
            _s = lond + (1 - _c) * F * _aSin * (_aTan2 + _c * _s2Sin * (_aCosU + _c * _s2Cos * (-1 + 2 * _aCosU * _aCosU)));
            if (_n++ > 10) {
                break;
            }
        } while (Math.abs(_s - s) > 1e-12);
        return this.rad2deg(Math.atan2(cosU2 * sSin, cosU1 * u2Sin - u1Sin * cosU2 * sCos));
    }
    /**
     * タイル座標を取得
     * @param lat 緯度
     * @param lon 経度
     * @param z タイル座標Z
     * @returns タイル座標
     */
    tile(lat, lon, z) {
        const ret = new mapsTile();
        const lng_rad = lon * Math.PI / 180;
        const lat_rad = lat * Math.PI / 180;
        const R = 128 / Math.PI;
        const worldCoordX = R * (lng_rad + Math.PI);
        const pixelCoordX = worldCoordX * Math.pow(2, z);
        const tileCoordX = Math.floor(pixelCoordX / this.TILE.SIZE);
        const worldCoordY = -R / 2 * Math.log((1 + Math.sin(lat_rad)) / (1 - Math.sin(lat_rad))) + 128;
        const pixelCoordY = worldCoordY * Math.pow(2, z);
        const tileCoordY = Math.floor(pixelCoordY / this.TILE.SIZE);
        ret.x = tileCoordX;
        ret.px_x = Math.floor(pixelCoordX - tileCoordX * this.TILE.SIZE);
        ret.y = tileCoordY;
        ret.px_y = Math.floor(pixelCoordY - tileCoordY * this.TILE.SIZE);
        ret.z = z;
        return ret;
    }
    /**
     * タイル座標から緯度経度を取得
     * @param x タイル座標X
     * @param y タイル座標Y
     * @param z タイル座標Z
     * @returns 緯度経度
     */
    tile2LatLng(x, y, z) {
        const ret = new mapsLatLon();
        const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        ret.lon = x / Math.pow(2, z) * 360 - 180;
        ret.lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
        return ret;
    }
    /**
     * タイル座標のズームレベルから縮尺を取得
     * @param z タイル座標Z
     * @param lat 緯度
     * @param dpi 解像度
     * @returns 縮尺
     */
    tileScale(z, lat, dpi) {
        return this.TILE.A * Math.sin(this.deg2rad(90 - lat)) / Math.pow(2, z) / this.TILE.SIZE * dpi / this.TILE.unitI2M;
    }
    /**
     * タイル座標のズームレベルを変更した場合のタイル座標を取得
     * @param x タイル座標X
     * @param y タイル座標X
     * @param z タイル座標Z
     * @param toz 変更するズームレベル
     * @returns タイル情報
     */
    tile2z(x, y, z, toz) {
        const ret = new mapsTile();
        const scale = Math.pow(2, z - toz);
        x = Math.floor((x * this.TILE.SIZE / scale) / this.TILE.SIZE);
        y = Math.floor((y * this.TILE.SIZE / scale) / this.TILE.SIZE);
        ret.x = x;
        ret.y = y;
        ret.z = toz;
        return ret;
    }
    /**
     * 標高タイルから標高データを取得
     * @param tile タイル座標
     * @param t タイル種別
     * @returns Promise<mapsTileDem>
     */
    tileDem(tile, t) {
        let ret = null;
        const key = Date.now();
        let f = true;
        if (t === mapsTypeTile.TXT) {
            this.TILE_DEM_URL[key] = this.tileDemUrlTxt(tile.x, tile.y, tile.z);
        }
        else if (t === mapsTypeTile.PNG) {
            this.TILE_DEM_URL[key] = this.tileDemUrlPng(tile.x, tile.y, tile.z);
        }
        else {
            f = false;
        }
        if (f === true) {
            ret = this.tileDemRequest(key, tile, t, false);
        }
        return ret;
    }
    /**
     * 標高タイルから標高データを取得（TXT形式）
     * @param tile タイル座標
     * @returns Promise<mapsTileDem>
     */
    tileDemTxt(tile) {
        return this.tileDem(tile, mapsTypeTile.TXT);
    }
    /**
     * 標高タイルから標高データを取得（PNG形式）
     * 説明：
     * HTML5 に対応したブラウザで動作します
     * @param tile タイル座標
     * @returns Promise<mapsTileDem>
     */
    tileDemPng(tile) {
        return this.tileDem(tile, mapsTypeTile.PNG);
    }
    /**
     * 標高タイルから標高データを取得[Ajax]
     * @param key 処理キー
     * @param tile タイル座標
     * @param t タイル種別
     * @param f Call フラグ
     * @returns Promise<mapsTileDem>
     */
    tileDemRequest(key, tile, t, f) {
        return new Promise((resolve, reject) => {
            if (key in this.TILE_DEM_URL) {
                if (f === true) {
                    this.TILE_DEM_URL[key].shift();
                }
                const dems = this.TILE_DEM_URL[key];
                if (dems.length > 0) {
                    const url = dems[0].url;
                    if (t === mapsTypeTile.TXT) {
                        fetch(url, {
                            method: "GET"
                        }).then(response => {
                            if (response.status === 200) {
                                response.text().then(text => {
                                    let dem = [];
                                    let e = NaN;
                                    if (text.length > 0) {
                                        dem = text.replace(/\r\n/g, "\n").replace(/\n/g, ",").slice(0, -1).split(",");
                                        e = this.tileDemData2ETxt(dem, tile.px_x, tile.px_y);
                                    }
                                    delete this.TILE_DEM_URL[key];
                                    resolve(new mapsTileDem(tile, t, url, dem, e));
                                });
                            }
                        }).catch(error => {
                            this.tileDemRequest(key, tile, t, true);
                        });
                    }
                    else if (t === mapsTypeTile.PNG) {
                        const oImg = document.createElement("img");
                        oImg.onload = () => {
                            let dem = [];
                            let e = NaN;
                            const oCanvas = document.createElement("canvas");
                            oCanvas.width = 256;
                            oCanvas.height = 256;
                            const oCanvasCTX = oCanvas.getContext("2d");
                            if (oCanvasCTX) {
                                oCanvasCTX.drawImage(oImg, 0, 0, 256, 256);
                                const data = oCanvasCTX.getImageData(0, 0, 256, 256).data;
                                if (data.length > 0) {
                                    dem = this.tileDemDataPng(data, tile.x, tile.y, tile.z);
                                    e = this.tileDemData2E(dem, tile.px_x, tile.px_y);
                                }
                            }
                            delete this.TILE_DEM_URL[key];
                            resolve(new mapsTileDem(tile, t, url, dem, e));
                        };
                        oImg.onerror = () => {
                            this.tileDemRequest(key, tile, t, true);
                        };
                        oImg.crossOrigin = "anonymous";
                        oImg.src = url;
                    }
                }
                else {
                    delete this.TILE_DEM_URL[key];
                }
            }
        });
    }
    /**
     * 標高タイルURLを取得
     * 説明：
     * 該当するタイル番号と標高データは必ず一致するとは限りません。
     * ズームレベル 9 以上の場合、
     * DEM5A、DEM5Bは、ズームレベル15 のタイル座標に変換
     * DEM10Bは、ズームレベル9～14はそのまま採用し、14以上は、ズームレベル14でのタイル座標に変換
     * @param x タイル座標X
     * @param y タイル座標Y
     * @param z タイル座標Z
     * @param t タイル種別
     * @returns 標高タイル情報(配列)
     */
    tileDemUrl(x, y, z, t) {
        const ret = [];
        const url = "https://cyberjapandata.gsi.go.jp/xyz/";
        let urlType = "_png";
        let urlExt = "png";
        if (t === mapsTypeTile.TXT) {
            urlType = "";
            urlExt = "txt";
        }
        if (this.TILE_DEM.Scale8 === null) {
            this.TILE_DEM.Scale8 = this.tileDemUrlInit([
                "8/215/108", "8/215/109", "8/215/110", "8/216/108", "8/216/109", "8/216/110",
                "8/217/109",
                "8/218/107", "8/218/108",
                "8/219/101", "8/219/102", "8/219/103", "8/219/104", "8/219/105", "8/219/106", "8/219/107", "8/219/108",
                "8/220/101", "8/220/102", "8/220/103", "8/220/104", "8/220/105", "8/220/106", "8/220/107",
                "8/221/101", "8/221/102", "8/221/103", "8/221/104", "8/221/105", "8/221/108", "8/221/109", "8/221/110", "8/221/99",
                "8/222/100", "8/222/101", "8/222/102", "8/222/103",
                "8/223/100", "8/223/101", "8/223/102",
                "8/224/100", "8/224/101", "8/224/102", "8/224/113", "8/224/99",
                "8/225/100", "8/225/101", "8/225/102", "8/225/98", "8/225/99",
                "8/226/100", "8/226/101", "8/226/102", "8/226/98", "8/226/99",
                "8/227/100", "8/227/101", "8/227/102", "8/227/103", "8/227/104", "8/227/105", "8/227/93", "8/227/94", "8/227/95", "8/227/96", "8/227/97", "8/227/98", "8/227/99",
                "8/228/100", "8/228/107", "8/228/108", "8/228/109", "8/228/110", "8/228/91", "8/228/92", "8/228/93", "8/228/94", "8/228/95", "8/228/96", "8/228/97", "8/228/98", "8/228/99",
                "8/229/107", "8/229/108", "8/229/91", "8/229/92", "8/229/93", "8/229/94", "8/229/95", "8/229/97",
                "8/230/92", "8/230/93", "8/230/94", "8/231/92", "8/231/93", "8/231/94", "8/232/91", "8/232/92", "8/232/93", "8/233/91", "8/233/92",
                "8/237/110"
            ]);
            this.TILE_DEM.Scale9 = this.tileDemUrlInit([
                "9/442/198",
                "9/438/202", "9/438/203",
                "9/439/202", "9/439/203",
                "9/457/182",
                "9/458/182",
                "9/442/197"
            ]);
            /*
            this.TILE_DEM.Scale10 = this.tileDemUrlInit(
                [
                "10/879/406",
                "10/879/407"
                ]
            );
            */
        }
        const fScale8 = this.TILE_DEM.Scale8 ? this.tileDemUrlExist(this.TILE_DEM.Scale8, x, y, z, 8) : false;
        const fScale9 = this.TILE_DEM.Scale9 ? this.tileDemUrlExist(this.TILE_DEM.Scale9, x, y, z, 9) : false;
        //const fScale10 = this.TILE_DEM.Scale10 ? this.tileDemUrlExist(this.TILE_DEM.Scale10, x, y, z, 10) : false;
        if (z >= 9) {
            if (!fScale9) {
                if (z >= 15) {
                    const tile = this.tile2z(x, y, z, 15);
                    {
                        const tileUrl = new mapsTileUrl();
                        tileUrl.setTile(tile, url, "dem5a" + urlType, urlExt);
                        ret.push(tileUrl);
                    }
                    {
                        const tileUrl = new mapsTileUrl();
                        tileUrl.setTile(tile, url, "dem5b" + urlType, urlExt);
                        ret.push(tileUrl);
                    }
                }
            }
            const tileUrl = new mapsTileUrl();
            if (z >= 14) {
                tileUrl.tile = this.tile2z(x, y, z, 14);
            }
            else {
                tileUrl.tile = new mapsTile();
                tileUrl.tile.x = x;
                tileUrl.tile.y = y;
                tileUrl.tile.z = z;
            }
            tileUrl.setUrl(url, "dem" + urlType, urlExt);
            ret.push(tileUrl);
        }
        if (z <= 8 || !fScale8 || fScale9) {
            const tileUrl = new mapsTileUrl();
            tileUrl.set(x, y, z, url, "demgm" + urlType, urlExt);
            ret.push(tileUrl);
        }
        return ret;
    }
    /**
     * 標高タイルURLを取得（TXT形式)
     * @param x タイル座標X
     * @param y タイル座標Y
     * @param z タイル座標Z
     * @returns 標高タイル情報(配列)
     */
    tileDemUrlTxt(x, y, z) {
        return this.tileDemUrl(x, y, z, mapsTypeTile.TXT);
    }
    /**
     * 標高タイルURLを取得（PNG形式)
     * @param x タイル座標X
     * @param y タイル座標Y
     * @param z タイル座標Z
     * @returns 標高タイル情報(配列)
     */
    tileDemUrlPng(x, y, z) {
        return this.tileDemUrl(x, y, z, mapsTypeTile.PNG);
    }
    /**
     * 標高タイルURLを取得（初期処理）
     * @param d タイルURLデータ
     * @returns エリア
     */
    tileDemUrlInit(d) {
        const ret = {};
        d.map((key, n, d) => {
            ret[key] = true;
        });
        return ret;
    }
    /**
     * 標高タイルURLを取得（判定）
     * @param area エリア
     * @param x タイル座標X
     * @param y タイル座標X
     * @param z タイル座標Z
     * @param toz 変更するズームレベル
     * @returns タイルURL
     */
    tileDemUrlExist(area, x, y, z, toz) {
        const tile = this.tile2z(x, y, z, toz);
        if (tile.z + "/" + tile.x + "/" + tile.y in area) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * 標高タイルデータ（PNG形式）から標高データ配列を取得
     * @param data 標高データ（PNG形式の配列）
     * @param x タイル座標X
     * @param y タイル座標Y
     * @param z タイル座標Z
     * @returns 標高データ配列
     */
    tileDemDataPng(data, x, y, z) {
        const ret = Array(this.TILE.SIZE * this.TILE.SIZE);
        let n = 0;
        for (let iy = 0; iy < this.TILE.SIZE; ++iy) {
            for (let ix = 0; ix < this.TILE.SIZE; ++ix) {
                let i = (iy * this.TILE.SIZE * 4) + (ix * 4);
                const r = data[i + 0];
                const g = data[i + 1];
                const b = data[i + 2];
                if (r != 128 || g != 0 || b != 0) {
                    const d = r * this.TILE.pow2_16 + g * this.TILE.pow2_8 + b;
                    let h = (d < this.TILE.pow2_23) ? d : d - this.TILE.pow2_24;
                    if (h == -this.TILE.pow2_23) {
                        h = 0;
                    }
                    else {
                        h *= 0.01;
                    }
                    ret[n] = h;
                }
                else {
                    ret[n] = 0;
                }
                n++;
            }
        }
        return ret;
    }
    /**
     * 標高タイルデータ（標高データ数値配列）から標高を取得
     * @param data 標高データ配列
     * @param px_x タイル内座標X[pixel]
     * @param px_y タイル内座標Y[pixel]
     * @returns 標高(m)
     */
    tileDemData2E(data, px_x, px_y) {
        let ret = 0;
        if (Array.isArray(data)) {
            if (data.length === this.TILE.SIZE * this.TILE.SIZE) {
                const i = (px_y * this.TILE.SIZE) + (px_x);
                if (i < data.length) {
                    ret = data[i];
                }
            }
        }
        return ret;
    }
    /**
     * 標高タイルデータ（標高データ文字配列）から標高を取得
     * @param data 標高データ配列
     * @param px_x タイル内座標X[pixel]
     * @param px_y タイル内座標Y[pixel]
     * @returns 標高(m)
     */
    tileDemData2ETxt(data, px_x, px_y) {
        let ret = NaN;
        if (Array.isArray(data)) {
            if (data.length === this.TILE.SIZE * this.TILE.SIZE) {
                const i = (px_y * this.TILE.SIZE) + (px_x);
                if (i < data.length) {
                    if (/^[+,-]?([1-9]\d*|0)(\.\d+)?$/.test(data[i])) {
                        ret = parseFloat(data[i]);
                    }
                }
            }
        }
        return ret;
    }
    /**
     * Garmin GPSログ(GPX)を取得
     * @param url GPXファイル
     * @returns Promise<mapsDataGpx>
     */
    gpx(url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "GET"
            }).then(response => {
                if (response.status === 200) {
                    response.text().then(text => {
                        if (text.length > 0) {
                            resolve(new mapsDataGpx(url, text));
                        }
                    });
                }
                else {
                    resolve(new mapsDataGpx(url, null));
                }
            }).catch(error => {
                resolve(new mapsDataGpx(url, null));
            });
        });
    }
}
