"use strict";
/**
 * 初期処理
 * @param id DivID
 * @returns 処理ステータス
 */
function init(id) {
    var oDiv = document.getElementById(id);
    if (oDiv) {
        if (oDiv.getAttribute("data-init") === "true") {
            return false;
        }
        else {
            oDiv.setAttribute("data-init", "true");
            return true;
        }
    }
    return false;
}
/**
 * ページ
 */
function page() {
    var oMaps = new maps();
    var oAppMap = null;
    var oappMapsGSI = new appMapsGSI(oMaps);
    var vDiv = ["Accuracy", "Distance", "DistanceTo", "Scale", "Tile", "TileE", "DataGpx"];
    var fDiv = {};
    vDiv.map(function (key, n, vDiv) {
        fDiv[key] = false;
        var oDiv = document.getElementById(key);
        if (oDiv) {
            oDiv.style.display = "none";
        }
    });
    var vHash = window.location.hash;
    var vHashDiv = "";
    if (vHash.length > 0) {
        vHash = vHashDiv = vHash.substring(1);
        if (vHash === "TileE") {
            vHashDiv = "Tile";
        }
        var oDiv = document.getElementById(vHashDiv);
        if (oDiv !== null) {
            oDiv.style.display = "block";
            fDiv[vHash] = true;
            vDiv = null;
        }
    }
    if (vDiv !== null) {
        vDiv.map(function (key, n, vDiv) {
            var oDiv = document.getElementById(key);
            if (oDiv !== null) {
                oDiv.style.display = "none";
                fDiv[key] = false;
            }
        });
    }
    /*==============================================================================================*/
    // 地図
    var _MapLat = 35.681236;
    var _MapLon = 139.767125;
    var _MapZ = 5;
    var _MapOptions = {};
    _MapOptions.w = 100;
    _MapOptions.wUnit = "%";
    _MapOptions.h = 600;
    _MapOptions.hUnit = "px";
    /*==============================================================================================*/
    // 精度
    if (fDiv["Accuracy"] === true) {
        if (!init("Accuracy")) {
            return;
        }
        var oMapsDataPrefCapital = new mapsDataPrefCapital();
        var dmapsDataPrefCapital = oMapsDataPrefCapital.get();
        oAppMap = new appMap("appAccuracyMap", _MapLat, _MapLon, _MapZ, _MapOptions);
        var distanceTo_1 = [10, 100, 1000, 10000, 100000];
        dmapsDataPrefCapital.map(function (item, n, dmapsDataPrefCapital) {
            if (!oAppMap) {
                return;
            }
            var pref = item.pref;
            var lat = item.lat;
            var lon = item.lon;
            var options = {};
            distanceTo_1.map(function (distance, n, distanceTo) {
                if (!oAppMap) {
                    return;
                }
                for (var i = 0; i < 2; i++) {
                    var a = 0;
                    var atob_1 = [];
                    var atob_item = new Array(2);
                    atob_item[0] = lat;
                    atob_item[1] = lon;
                    atob_1.push(atob_item);
                    if (i === 0) {
                        a = 0;
                    }
                    else if (i === 1) {
                        a = 180;
                    }
                    var c = oMaps.distanceTo(lat, lon, a, distance);
                    options.color = "blue";
                    options.popup = "<ol style=\"list-style-type: none;\"><li>" + pref + "から" + distance.toLocaleString() + "m" + "</li><li>緯度：" + lat + "</li><li>経度：" + lon + "</li></ol>";
                    oAppMap.point(c.lat, lon, options);
                    atob_1.push(new Array(c.lat, lon));
                    options = {};
                    options.color = "#4169e1";
                    oAppMap.arc(atob_1, options);
                }
            });
            options.color = "red";
            options.popup = "<ol style=\"list-style-type: none;\"><li>" + pref + "</li><li>緯度：" + lat + "</li><li>経度：" + lon + "</li></ol>";
            oAppMap.point(lat, lon, options);
        });
    }
    /*==============================================================================================*/
    // ２地点間の距離＆ある地点から角度と距離を指定して地点を求める
    if (fDiv["Distance"] === true || fDiv["DistanceTo"] === true) {
        var oMapsDataPrefCapital = new mapsDataPrefCapital();
        var dmapsDataPrefCapital = oMapsDataPrefCapital.get();
        var base_1 = 12;
        var item_base_1 = dmapsDataPrefCapital[base_1];
        var _loop_1 = function (t) {
            var oDiv = null;
            if (t === 0) {
                if (!init("Distance")) {
                    return { value: void 0 };
                }
                // ２地点間の距離を求める
                oDiv = document.getElementById("appDistance");
                oAppMap = new appMap("appDistanceMap", _MapLat, _MapLon, _MapZ, _MapOptions);
            }
            else if (t === 1) {
                if (!init("appDistanceTo")) {
                    return { value: void 0 };
                }
                // ある地点から角度と距離を指定して地点を求める
                oDiv = document.getElementById("appDistanceTo");
                oAppMap = new appMap("appDistanceToMap", _MapLat, _MapLon, _MapZ, _MapOptions);
            }
            if (!oDiv || !oAppMap) {
                return { value: void 0 };
            }
            var oDivTitle = document.createElement("div");
            oDivTitle.innerHTML = item_base_1.pref + "からの距離";
            oDiv.appendChild(oDivTitle);
            var dl = document.createElement("dl");
            var dt = document.createElement("dt");
            var dd_lat = document.createElement("dd");
            var dd_lon = document.createElement("dd");
            var dd_distT = document.createElement("dd");
            var dd_distH = document.createElement("dd");
            var dd_distS = document.createElement("dd");
            var dd_a = document.createElement("dd");
            var dd_c_lat = document.createElement("dd");
            var dd_c_lon = document.createElement("dd");
            dt.innerHTML = "県庁";
            dd_lat.innerHTML = "緯度";
            dd_lon.innerHTML = "経度";
            dd_distT.innerHTML = "距離<br/>（三角球面法）";
            dd_distH.innerHTML = "距離<br/>（ヒュベニ）";
            dd_distS.innerHTML = "距離<br/>（測地線航海算法）";
            dd_a.innerHTML = "方角";
            if (t === 1) {
                dd_c_lat.innerHTML = "経度を算出=<br />方角＋距離<br/>（ヒュベニ）";
                dd_c_lon.innerHTML = "経度を算出=<br />方角＋距離<br/>（ヒュベニ）";
            }
            dl.appendChild(dt);
            dl.appendChild(dd_lat);
            dl.appendChild(dd_lon);
            dl.appendChild(dd_distT);
            dl.appendChild(dd_distH);
            dl.appendChild(dd_distS);
            dl.appendChild(dd_a);
            if (t === 1) {
                dl.appendChild(dd_c_lat);
                dl.appendChild(dd_c_lon);
            }
            oDiv.appendChild(dl);
            var options = {};
            options.color = "red";
            options.popup = item_base_1.pref;
            oAppMap.point(item_base_1.lat, item_base_1.lon, options);
            dmapsDataPrefCapital.map(function (item, n, dmapsDataPrefCapital) {
                if (!oDiv || !oAppMap) {
                    return;
                }
                if (n !== base_1) {
                    dl = document.createElement("dl");
                    dt = document.createElement("dt");
                    dd_lat = document.createElement("dd");
                    dd_lon = document.createElement("dd");
                    dd_distT = document.createElement("dd");
                    dd_distH = document.createElement("dd");
                    dd_distS = document.createElement("dd");
                    dd_a = document.createElement("dd");
                    dd_c_lat = document.createElement("dd");
                    dd_c_lon = document.createElement("dd");
                    if (t === 0) {
                        item.distT = oMaps.distanceT(item_base_1.lat, item_base_1.lon, item.lat, item.lon);
                        item.distH = oMaps.distanceH(item_base_1.lat, item_base_1.lon, item.lat, item.lon);
                        item.distS = oMaps.distanceS(item_base_1.lat, item_base_1.lon, item.lat, item.lon);
                        item.a = oMaps.direction(item_base_1.lat, item_base_1.lon, item.lat, item.lon);
                    }
                    else if (t === 1) {
                        var c = oMaps.distanceTo(item_base_1.lat, item_base_1.lon, item.a, item.distH);
                        item.c_lat = c.lat;
                        item.c_lon = c.lon;
                        dd_c_lat.innerHTML = "" + item.c_lat;
                        dd_c_lon.innerHTML = "" + item.c_lon;
                    }
                    dt.innerHTML = item.pref;
                    dd_lat.innerHTML = "" + item.lat;
                    dd_lon.innerHTML = "" + item.lon;
                    dd_distT.innerHTML = "" + item.distT / 1000;
                    dd_distH.innerHTML = "" + item.distH / 1000;
                    dd_distS.innerHTML = "" + item.distS / 1000;
                    dd_a.innerHTML = "" + item.a;
                    dl.appendChild(dt);
                    dl.appendChild(dd_lat);
                    dl.appendChild(dd_lon);
                    dl.appendChild(dd_distT);
                    dl.appendChild(dd_distH);
                    dl.appendChild(dd_distS);
                    dl.appendChild(dd_a);
                    if (t === 1) {
                        dl.appendChild(dd_c_lat);
                        dl.appendChild(dd_c_lon);
                    }
                    oDiv.appendChild(dl);
                    options = {};
                    options.color = "blue";
                    options.popup = "<ol style=\"list-style-type: none;\"><li>" + item.pref + "</li><li>緯度：" + item.lat + "</li><li>経度：" + item.lon + "</li></ol>";
                    oAppMap.point(item.lat, item.lon, options);
                    if (t === 1) {
                        options = {};
                        options.color = "green";
                        options.popup = "<ol style=\"list-style-type: none;\"><li>" + item.pref + "</li><li>" + item_base_1.pref + "から距離[" + item.distH + "m],方角[" + item.a + "]で求めた地点" + "</li></ol>";
                        oAppMap.point(item.c_lat, item.c_lon, options);
                    }
                    var atob_2 = [];
                    atob_2.push(new Array(item_base_1.lat, item_base_1.lon));
                    atob_2.push(new Array(item.lat, item.lon));
                    options = {};
                    options.color = "#4169e1";
                    options.popup = "<ol style=\"list-style-type: none;\"><li>" + item_base_1.pref + "→" + item.pref + "</li><li>距離：" + item.distH.toLocaleString() + "</li><li>方角：" + item.a + "</li></ol>";
                    oAppMap.arc(atob_2, options);
                }
            });
        };
        for (var t = 0; t < 2; t++) {
            var state_1 = _loop_1(t);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    /*==============================================================================================*/
    // ズームレベルと縮尺
    if (fDiv["Scale"] === true) {
        if (!init("Scale")) {
            return;
        }
        var vDPI = 96;
        var vTitle = "ズームレベルと縮尺";
        _MapLat = 35.65809922;
        _MapLon = 139.741357472;
        var oDiv = document.getElementById("Scale");
        if (oDiv) {
            oDiv.style.width = "800px";
        }
        var oDivTitle = document.getElementById("appScaleTitle");
        if (oDivTitle) {
            oDivTitle.innerHTML = vTitle;
        }
        var oDivTitleSub = document.getElementById("appScaleTitleSub");
        if (oDivTitleSub) {
            oDivTitleSub.innerHTML = "日本経緯度原点（東京都港区麻布台2 - 18 - 1）<br>緯度[ " + _MapLat + " ]、解像度 [ " + vDPI + " ] dpi で計算";
        }
        var oTable = document.createElement("table");
        var oTableTr = document.createElement("tr");
        var oTableTd = document.createElement("th");
        oTableTd.innerHTML = "ズームレベル";
        oTableTr.append(oTableTd);
        oTableTd = document.createElement("th");
        oTableTd.innerHTML = "縮尺";
        oTableTr.append(oTableTd);
        oTable.append(oTableTr);
        for (var i = 0; i < 29; i++) {
            oTableTr = document.createElement("tr");
            oTableTd = document.createElement("td");
            oTableTd.innerHTML = "" + i;
            oTableTr.append(oTableTd);
            oTableTd = document.createElement("td");
            oTableTd.innerHTML = "1 / " + Math.floor(oMaps.tileScale(i, _MapLat, vDPI)).toLocaleString();
            oTableTr.append(oTableTd);
            oTable.append(oTableTr);
        }
        if (oDiv) {
            oDiv.append(oTable);
        }
    }
    /*==============================================================================================*/
    // 緯度経度からタイル情報を取得し、タイル左上原点の緯度経度と標高タイルから標高値を求める
    if (fDiv["Tile"] === true || fDiv["TileE"] === true) {
        _MapZ = 4;
        _MapLat = 35.360771305;
        _MapLon = 138.7273035;
        var vTitle = "緯度経度からタイル情報を取得し、タイル左上原点の緯度経度を求める";
        if (vHash === "" || vHash === "TileE") {
            vTitle = "緯度経度からタイル情報を取得し、タイル左上原点の緯度経度と標高タイルから標高値を求める";
        }
        var vUrl = "";
        var oDiv = document.getElementById("Tile");
        if (oDiv) {
            oDiv.style.width = "900px";
        }
        var oDivTitle = document.getElementById("appTileTitle");
        if (oDivTitle) {
            oDivTitle.innerHTML = vTitle;
        }
        var oDivTitleSub = document.getElementById("appTileTitleSub");
        if (oDivTitleSub) {
            oDivTitleSub.innerHTML = "富士山山頂の緯度[ " + _MapLat + " ]、緯度 [ " + _MapLon + " ] からタイルとタイル情報を計算";
        }
        oDiv = document.getElementById("appTile");
        if (!oDiv) {
            return;
        }
        oappMapsGSI.setDiv(oDiv);
        for (var i = _MapZ; i < 19; i++) {
            var vTile = oMaps.tile(_MapLat, _MapLon, i);
            var vTileLatLon = null;
            vUrl = "https://cyberjapandata.gsi.go.jp/xyz/std/" + vTile.z + "/" + vTile.x + "/" + vTile.y + ".png";
            var oTable = document.createElement("table");
            oTable.style.width = "890px";
            //
            var oTableTr = document.createElement("tr");
            var oTableTd = document.createElement("th");
            oTableTd.style.textAlign = "left";
            oTableTd.innerHTML = "ズームレベル";
            oTableTr.append(oTableTd);
            oTableTd = document.createElement("td");
            oTableTd.innerHTML = "" + vTile.z;
            oTableTr.append(oTableTd);
            oTable.append(oTableTr);
            //
            oTableTr = document.createElement("tr");
            oTableTd = document.createElement("th");
            oTableTd.style.textAlign = "left";
            oTableTd.innerHTML = "タイル座標座標(X, Y)";
            oTableTr.append(oTableTd);
            oTableTd = document.createElement("td");
            oTableTd.innerHTML = "" + vTile.x + ", " + vTile.y;
            oTableTr.append(oTableTd);
            oTable.append(oTableTr);
            //
            oTableTr = document.createElement("tr");
            oTableTd = document.createElement("th");
            oTableTd.style.textAlign = "left";
            oTableTd.innerHTML = "タイル左上からpixel 値(X, Y)";
            oTableTr.append(oTableTd);
            oTableTd = document.createElement("td");
            oTableTd.innerHTML = "" + vTile.px_x + ", " + vTile.px_y;
            oTableTr.append(oTableTd);
            oTable.append(oTableTr);
            //
            vTileLatLon = oMaps.tile2LatLng(vTile.x, vTile.y, vTile.z);
            oTableTr = document.createElement("tr");
            oTableTd = document.createElement("th");
            oTableTd.style.textAlign = "left";
            oTableTd.innerHTML = "タイル左上の緯度、経度";
            oTableTr.append(oTableTd);
            oTableTd = document.createElement("td");
            oTableTd.innerHTML = "" + vTileLatLon.lat + ", " + vTileLatLon.lon;
            oTableTr.append(oTableTd);
            oTable.append(oTableTr);
            //
            if (vHash === "" || vHash === "TileE") {
                oTableTr = document.createElement("tr");
                oTableTd = document.createElement("th");
                oTableTd.style.textAlign = "left";
                oTableTd.innerHTML = "標高（TXT形式）<br>標高タイル";
                oTableTr.append(oTableTd);
                oTableTd = document.createElement("td");
                oTableTd.innerHTML = "<div id=\"appTileDem" + vTile.z + "Txt\"></div>";
                oTableTr.append(oTableTd);
                oTable.append(oTableTr);
                //
                oTableTr = document.createElement("tr");
                oTableTd = document.createElement("th");
                oTableTd.style.textAlign = "left";
                oTableTd.innerHTML = "標高（PNG形式）<br>標高タイル";
                oTableTr.append(oTableTd);
                oTableTd = document.createElement("td");
                oTableTd.innerHTML = "<div id=\"appTileDem" + vTile.z + "Png\"></div>";
                oTableTr.append(oTableTd);
                oTable.append(oTableTr);
            }
            var oImg = document.createElement("img");
            oappMapsGSI.setTile(oImg, vTile);
            oImg.src = vUrl;
            oImg.onload = function (e) {
                oappMapsGSI.Symbol(24, 24);
            };
            oDiv.append(oTable);
            oDiv.append(oImg);
            if (vHash === "" || vHash === "TileE") {
                if (oMaps) {
                    var oMapTileDem = oMaps.tileDemTxt(vTile);
                    if (oMapTileDem) {
                        oMapTileDem.then(function (data) {
                            if (!data.tile) {
                                return;
                            }
                            var o = document.getElementById("appTileDem" + data.tile.z + "Txt");
                            if (!o) {
                                return;
                            }
                            if (data.e === NaN) {
                                o.innerHTML = "標高データなし";
                            }
                            else {
                                o.innerHTML = data.e.toLocaleString() + " m" + "<br>" + data.url;
                            }
                        });
                    }
                    var oMapTileDemPng = oMaps.tileDemPng(vTile);
                    if (oMapTileDemPng) {
                        oMapTileDemPng.then(function (data) {
                            if (!data.tile) {
                                return;
                            }
                            var o = document.getElementById("appTileDem" + data.tile.z + "Png");
                            if (!o) {
                                return;
                            }
                            if (data.e === NaN) {
                                o.innerHTML = "標高データなし";
                            }
                            else {
                                o.innerHTML = data.e.toLocaleString() + " m" + "<br>" + data.url;
                            }
                        });
                    }
                }
            }
        }
    }
    /*==============================================================================================*/
    // GPX
    if (fDiv["DataGpx"] === true) {
        if (!init("DataGpx")) {
            return;
        }
        var vTitle = "Garamin の GPS ログデータ（GPX）を読み込んでグラフ表示";
        var oDivTitle = document.getElementById("appDataGpxTitle");
        if (oDivTitle) {
            oDivTitle.innerHTML = vTitle;
        }
        var oDiv = document.getElementById("appDataGpx");
        if (oDiv) {
            //
            var oDiv20190519_1 = document.createElement("div");
            var oDiv20190519_Title_1 = document.createElement("div");
            oDiv.appendChild(oDiv20190519_Title_1);
            oDiv.appendChild(oDiv20190519_1);
            oMaps.gpx("./data/20190519.gpx").then(function (data) {
                oDiv20190519_Title_1.innerHTML = data.getName();
                var o = new mapsDataGpxChart(oDiv20190519_1, data);
                o.refresh(1100, 500, 150);
            });
            //
            var oDiv20190428_1 = document.createElement("div");
            var oDiv20190428_Title_1 = document.createElement("div");
            oDiv.appendChild(oDiv20190428_Title_1);
            oDiv.appendChild(oDiv20190428_1);
            oMaps.gpx("./data/20190428.gpx").then(function (data) {
                oDiv20190428_Title_1.innerHTML = data.getName();
                var o = new mapsDataGpxChart(oDiv20190428_1, data);
                o.refresh(1100, 500, 150);
            });
            //
            var oDiv20180811_1 = document.createElement("div");
            var oDiv20180811_Title_1 = document.createElement("div");
            oDiv.appendChild(oDiv20180811_Title_1);
            oDiv.appendChild(oDiv20180811_1);
            oMaps.gpx("./data/20180811.gpx").then(function (data) {
                oDiv20180811_Title_1.innerHTML = data.getName();
                var o = new mapsDataGpxChart(oDiv20180811_1, data);
                o.refresh(1100, 500, 150);
            });
        }
    }
}
/**
 * window.onload
 */
window.onload = function () {
    page();
};
/**
 * window.onhashchange
 */
window.onhashchange = function () {
    page();
};
