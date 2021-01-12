"use strict";
/**
 * ChartJS.Index
 */
class ChartIndex {
    constructor() {
        this.init = false;
        this.index = 0;
        this.datasetIndex = 0;
        this._index = 0;
        this._datasetIndex = 0;
        this._active_index = 0;
        this._active_datasetIndex = 0;
    }
}
/**
 * 地図：データ：Garmin GPSログ(GPX)：標高図
 *  ver:5.0.13 -> http://fontawesome.io/
 *  ver:2.7.2  -> http://www.chartjs.org/
 */
class mapsDataGpxChart {
    /**
     * constructor
     * @param o Div Object
     * @param data : GPXデータ
     */
    constructor(o, data) {
        /**
         * DIV
         */
        this.o = null;
        /**
         * GPX データ
         */
        this.data = null;
        /**
         * スクリーン
         */
        this.oScreen = null;
        /**
         * スクリーン：フラグ
         */
        this.fScreen = false;
        /**
         * 標高図
         */
        this.oChart = null;
        /**
         * 標高図：図
         */
        this.oChartCanvas = null;
        /**
         * 標高図：図：データ
         */
        this.oChartCanvasData = null;
        /**
         * 標高図：図：データ
         */
        this.vChartCanvasData = [];
        this.vChartCanvasDataLabels = [];
        this.vChartCanvasDataLabelsDistance = [];
        /**
         * 標高図：図：描画：Timeout
         */
        this.vChartCanvasData_DrawTM = null;
        /**
         * 標高図：図：Activeデータインデックス
         */
        this.oChartCanvasData_Active = null;
        /**
         * 標高図：イベント：ホバー（コールバック関数）
         */
        this.fChartHoverCallback = null;
        /* イベント設定：ホバー
         * args
         *  Object eHover : コールバック関数
         */
        this.setEventHover = (fnc) => {
            if (this.fChartHoverCallback !== fnc) {
                this.fChartHoverCallback = fnc;
            }
        };
        this.o = o;
        this.data = data;
        this.create();
    }
    /**
     * 生成
     */
    create() {
        if (!this.o) {
            return;
        }
        this.o.innerHTML = "";
        let fCreate = false;
        if (this.oChart === null) {
            fCreate = true;
            if (this.data) {
                this.data.getLogs().map((log, n, data) => {
                    this.vChartCanvasData.push(log.e);
                    this.vChartCanvasDataLabels.push("" + Math.ceil(log.distance / 1000));
                    this.vChartCanvasDataLabelsDistance.push("" + Math.ceil(log.distance * 1000) / 1000);
                });
            }
            let vScreenDisplay = "none";
            if (this.fScreen === true) {
                vScreenDisplay = "block";
            }
            this.oScreen = document.createElement("div");
            this.oScreen.style.position = "absolute";
            this.oScreen.style.display = vScreenDisplay;
            this.oScreen.style.textAlign = "right";
            this.oScreen.innerHTML = "<i class=\"fas fa-thumbtack\"></i>";
            this.oScreen.addEventListener("click", (e) => {
                return _this.eChartClick(e, null);
            });
            this.oChart = document.createElement("div");
            this.oChart.style.position = "relative";
            this.oChartCanvas = document.createElement("canvas");
            this.oChartCanvas.style.display = "none";
            this.oScreen.addEventListener("mouseout", (e) => {
                return _this.eHoverOut(e);
            });
            this.oChart.append(this.oChartCanvas);
            // <- ChartJS - JavaScript
            const oChartCanvas2D = this.oChartCanvas.getContext("2d");
            let _this = this;
            this.oChartCanvasData = new Chart(oChartCanvas2D, {
                type: "line",
                data: {
                    labels: this.vChartCanvasDataLabels,
                    datasets: [
                        {
                            data: this.vChartCanvasData,
                            fill: true,
                            lineTension: 0,
                            borderWidth: 1,
                            borderColor: "rgba(89, 185, 105, 1)",
                            backgroundColor: "rgba(89, 185, 105, 0.2)",
                            pointRadius: 0,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    minRotation: 0,
                                    maxRotation: 0,
                                    autoSkip: true,
                                    callback: (value) => {
                                        if (value === "-") {
                                            return "";
                                        }
                                        else {
                                            return value.toLocaleString() + "km";
                                        }
                                    }
                                }
                            }
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    minRotation: 0,
                                    maxRoDtation: 0,
                                    autoSkip: true,
                                    callback: (value) => {
                                        return value.toLocaleString() + " m";
                                    }
                                }
                            }
                        ]
                    },
                    legend: {
                        display: false
                    },
                    hover: {
                        mode: "nearest",
                        intersect: false
                    },
                    tooltips: {
                        enabled: true,
                        mode: "nearest",
                        callbacks: {
                            title: (i, data) => {
                                return "";
                            },
                            label: (i, data) => {
                                return "";
                            },
                            afterBody: (i, data) => {
                                return _this.eChartToolTipData(i, data);
                            }
                        }
                    },
                    onHover: (e, i) => {
                        return _this.eChartHover(e, i);
                    },
                    onClick: (e, i) => {
                        return _this.eChartClick(e, i);
                    }
                }
            });
            // -> ChartJS - JavaScript
        }
        if (fCreate) {
            this.o.append(this.oChart);
            if (this.o.parentElement && this.oScreen) {
                this.o.parentElement.append(this.oScreen);
            }
        }
    }
    /**
     * イベント：HoverOut
     * @param e MouseEvent
     */
    eHoverOut(e) {
        if (!this.fScreen) {
            this.toolTip(null);
        }
    }
    /**
     * イベント：Chart - Hover
     * @param e MouseEvent
     * @param i データインデックス
     * @returns イベントステータス
     */
    eChartHover(e, i) {
        if (!this.fScreen) {
            if (i.length > 0) {
                // ツールチップ
                this.toolTip(i[0]);
                this.eChartHoverCallback(i[0]);
            }
        }
        return true;
    }
    /**
     * イベント：Chart - Hover - callback
     * @param i データインデックス
     */
    eChartHoverCallback(i) {
        if (this.fChartHoverCallback !== null) {
            let data = this.eChartToolTipDataLog(i);
            let args = [];
            args.push(data);
            this.fChartHoverCallback.apply(this, args);
        }
    }
    /**
     * イベント：Chart - Click
     * @param e MouseEvent
     * @param i データインデックス
     * @returns イベントステータス
     */
    eChartClick(e, i) {
        this.fScreen = !this.fScreen;
        let vDisplay = "none";
        let vMode = "nearest";
        if (this.fScreen) {
            vDisplay = "block";
            vMode = null;
        }
        this.oChartCanvasData.options.hover.mode = vMode;
        this.oChartCanvasData.update();
        if (i !== null) {
            if (i.length > 0) {
                let _i = i[0];
                this.oChartCanvasData.tooltip._active_datasetIndex = _i._datasetIndex;
                this.oChartCanvasData.tooltip._active_index = _i._index;
            }
            if (typeof this.oChartCanvasData.tooltip._active_index === "number"
                &&
                    typeof this.oChartCanvasData.tooltip._active_datasetIndex === "number") {
                let _i = new ChartIndex();
                _i._index = this.oChartCanvasData.tooltip._active_index;
                _i._datasetIndex = this.oChartCanvasData.tooltip._active_datasetIndex;
                this.toolTip(_i);
            }
        }
        if (this.oScreen) {
            this.oScreen.style.display = vDisplay;
        }
        return false;
    }
    /**
     * ツールチップ
     * @param データインデックス
     */
    toolTip(i) {
        if (this.oChartCanvasData !== null) {
            let fOpen = false;
            let iData = null;
            let iDataSet = null;
            if (!this.oChartCanvasData.tooltip._active) {
                this.oChartCanvasData.tooltip._active = new Array();
            }
            if (i === null) {
                if (typeof this.oChartCanvasData.tooltip._active_index === "number"
                    &&
                        typeof this.oChartCanvasData.tooltip._active_datasetIndex === "number") {
                    iData = this.oChartCanvasData.tooltip._active_index;
                    iDataSet = this.oChartCanvasData.tooltip._active_datasetIndex;
                }
            }
            else {
                fOpen = true;
                iData = i._index;
                iDataSet = i._datasetIndex;
            }
            if (iData !== null
                &&
                    iDataSet !== null) {
                let vData = this.oChartCanvasData.getDatasetMeta(iDataSet).data[iData];
                let fSingle = true;
                // ツールチップ：単一
                if (fSingle) {
                    if (fOpen) {
                        this.oChartCanvasData.tooltip._active = [];
                    }
                }
                // ツールチップ：複数
                this.oChartCanvasData.tooltip._active.some((o, n, data) => {
                    if (o._index === vData._index) {
                        if (fOpen) {
                            vData = null;
                        }
                        else {
                            data._active.splice(n, 1);
                        }
                        return true;
                    }
                });
                i = new ChartIndex();
                i._index = iData;
                i._datasetIndex = iDataSet;
                if (vData !== null) {
                    i.init = true;
                    if (fOpen) {
                        this.oChartCanvasData.tooltip._active.push(vData);
                    }
                    this.oChartCanvasData.tooltip._active_datasetIndex = iDataSet;
                    this.oChartCanvasData.tooltip._active_index = iData;
                }
                this.toolTipDraw(i);
                this.oChartCanvasData.tooltip.update(true);
                this.oChartCanvasData.draw();
            }
        }
    }
    /**
     * ツールチップ：描画
     * @param データインデックス
     */
    toolTipDraw(i) {
        // 描画処理：呼び出し
        if (i === null) {
            if (this.vChartCanvasData_DrawTM !== null) {
                clearTimeout(this.vChartCanvasData_DrawTM);
                this.vChartCanvasData_DrawTM = null;
            }
            this.vChartCanvasData_DrawTM = setTimeout((o) => {
                if (o.oChartCanvasData_Active !== null) {
                    o.toolTipDraw(this.oChartCanvasData_Active);
                }
            }, 300, this);
        }
        else {
            // 設定
            if (i !== null
                && typeof i.init === "boolean") {
                if (i.init === true) {
                    this.vChartCanvasData_DrawTM = null;
                    this.oChartCanvasData_Active = new ChartIndex();
                    this.oChartCanvasData_Active._index = i._index;
                    this.oChartCanvasData_Active._datasetIndex = i._datasetIndex;
                }
                else {
                    this.vChartCanvasData_DrawTM = null;
                    this.oChartCanvasData_Active = null;
                }
            }
            // 描画処理：描画
            else {
                this.toolTip(i);
                this.eChartHoverCallback(i);
            }
        }
    }
    /**
     * ツールチップ：データ
     * @param i データインデックス
     * @param data データ.datasets, labels
     * @returns ツールチップ
     */
    eChartToolTipData(i, data) {
        return this.eChartToolTipDataLog(i[0]).text;
    }
    /**
     * ツールチップ：データ
     * @param i データインデックス
     * @returns データ
     */
    eChartToolTipDataLog(i) {
        let ret = new mapsDataGpxChartData();
        if (this.data) {
            let dataLogs = this.data.getLogs();
            let dataLog = dataLogs[i.index];
            let incline = "";
            let direction = "";
            if (dataLog.distanceText !== "") {
                incline = "" + dataLog.incline;
                direction = dataLog.direction + "°" + "(" + dataLog.directionName + ")";
            }
            ret.data = dataLog;
            ret.text.push("時間：" + dataLog.timeFormatJP);
            ret.text.push("距離：" + dataLog.distanceText);
            ret.text.push("緯度：" + dataLog.lat);
            ret.text.push("経度：" + dataLog.lon);
            ret.text.push("標高：" + dataLog.e.toLocaleString() + " m");
            ret.text.push("勾配：" + incline);
            ret.text.push("速度：" + dataLog.speed + " km/h");
            ret.text.push("方向：" + direction);
        }
        return ret;
    }
    /* 描画
     *  @param w  幅[px]
     *  @param h  高[px]
     *  @param wx 横グリッド幅[px]
     */
    refresh(w, h, wx) {
        let n = Math.floor(w / wx);
        w = wx * n;
        n += 1;
        if (this.oChart) {
            this.oChart.style.width = w + "px";
            this.oChart.style.height = h + "px";
            if (this.oScreen) {
                this.oScreen.style.width = w + "px";
                this.oScreen.style.height = h + "px";
                this.oScreen.style.top = this.oChart.offsetTop + "px";
                this.oScreen.style.left = this.oChart.offsetLeft + "px";
            }
        }
        this.oChartCanvasData.options.scales.xAxes[0].ticks.maxTicksLimit = n;
        this.oChartCanvasData.update();
        if (this.oChartCanvas) {
            this.oChartCanvas.style.display = "block";
        }
        this.toolTipDraw(null);
    }
    /** 選択
     * @time 時間
     */
    selectTime(time) {
        this.fScreen = false;
        let i = new ChartIndex();
        if (this.data) {
            this.data.getLogs().some((o, n, data) => {
                if (o.time === time) {
                    this.fScreen = true;
                }
                else {
                    if (this.data) {
                        let timeGPX_S = o.time;
                        let timeGPX_E = o.time;
                        if (timeGPX_S) {
                            timeGPX_S.setSeconds(timeGPX_S.getSeconds() - this.data.getlogsTMS());
                        }
                        if (timeGPX_E) {
                            timeGPX_E.setSeconds(timeGPX_E.getSeconds() + this.data.getlogsTMS());
                        }
                        if (timeGPX_S && timeGPX_E) {
                            if (timeGPX_S <= time && timeGPX_E >= time) {
                                this.fScreen = true;
                            }
                        }
                    }
                }
                if (this.fScreen) {
                    i._index = n;
                    return true;
                }
            });
        }
        if (this.fScreen) {
            i._datasetIndex = 0;
            this.toolTip(i);
        }
        else {
            this.toolTip(null);
        }
        this.toolTipDraw(i);
    }
}
/**
 * 地図：データ：Garmin GPSログ(GPX)：標高図 -> データ
 */
class mapsDataGpxChartData {
    constructor() {
        /**
         * データ
         */
        this.data = null;
        /**
         * テキスト
         */
        this.text = [];
    }
}
