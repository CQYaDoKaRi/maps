/**
 * ChartJS
 */
declare let Chart: {
	new(context: CanvasRenderingContext2D, data: {}): any;
}

/**
 * ChartJS.Index
 */
class ChartIndex {
	public init: boolean = false;

	public index: number = 0;
	public datasetIndex: number = 0;

	public _index: number = 0;
	public _datasetIndex: number = 0;

	public _active_index: number = 0;
	public _active_datasetIndex: number = 0;
}

/**
 * 地図：データ：Garmin GPSログ(GPX)：標高図
 *  ver:5.0.13 -> http://fontawesome.io/
 *  ver:2.7.2  -> http://www.chartjs.org/
 */
class mapsDataGpxChart {
	/**
	 * DIV
	 */
	private o: HTMLElement | null = null;

	/**
	 * GPX データ
	 */
	private data: mapsDataGpx | null = null;

	/**
	 * スクリーン
	 */
	private oScreen: HTMLElement | null = null;

	/**
	 * スクリーン：フラグ
	 */
	private fScreen: boolean = false;

	/**
	 * 標高図
	 */
	private oChart: HTMLElement | null = null;

	/**
	 * 標高図：図
	 */
	private oChartCanvas: HTMLCanvasElement | null = null;

	/**
	 * 標高図：図：データ
	 */
	private oChartCanvasData: any = null;

	/**
	 * 標高図：図：データ
	 */
	private vChartCanvasData: number[] = [];
	private vChartCanvasDataLabels: string[] = [];
	private vChartCanvasDataLabelsDistance: string[] = [];

	/**
	 * 標高図：図：描画：Timeout
	 */
	private vChartCanvasData_DrawTM: number | null = null;

	/**
	 * 標高図：図：Activeデータインデックス
	 */
	private oChartCanvasData_Active: ChartIndex | null = null;

	/**
	 * 標高図：イベント：ホバー（コールバック関数）
	 */
	private fChartHoverCallback: Function | null = null;

	/**
	 * constructor
	 * @param o Div Object
	 * @param data : GPXデータ
	 */
	constructor(o: HTMLElement, data: mapsDataGpx) {
		this.o = o;
		this.data = data;

		this.create();
	}

	/**
	 * 生成
	 */
	public create() {
		if(!this.o) {
			return;
		}

		this.o.innerHTML = "";

		let fCreate: boolean = false;
		if (this.oChart === null) {
			fCreate = true;

			if(this.data) {
				this.data.getLogs().map((log: mapsDataGpxLog, n: number, data: mapsDataGpxLog[]) => {
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
			this.oScreen.addEventListener("click",
				(e: {}) => {
					return _this.eChartClick(e, null);
				}
			);

			this.oChart = document.createElement("div");
			this.oChart.style.position = "relative";

			this.oChartCanvas = document.createElement("canvas");
			this.oChartCanvas.style.display = "none";
			this.oScreen.addEventListener("mouseout",
				(e: {}) => {
					return _this.eHoverOut(e);
				}
			);

			this.oChart.append(this.oChartCanvas);

			// <- ChartJS - JavaScript
			const oChartCanvas2D: any = this.oChartCanvas.getContext("2d");
			let _this = this;
			this.oChartCanvasData = new Chart(
				oChartCanvas2D
				,
				{
					type: "line"
					, data: {
						labels: this.vChartCanvasDataLabels
						, datasets:
							[
								{
									data: this.vChartCanvasData
									, fill: true
									, lineTension: 0
									, borderWidth: 1
									, borderColor: "rgba(89, 185, 105, 1)"
									, backgroundColor: "rgba(89, 185, 105, 0.2)"
									, pointRadius: 0
									, pointHoverRadius: 5
								}
							]
					}
					, options: {
						responsive: true
						, maintainAspectRatio: false
						, scales:
						{
							xAxes: [
								{
									ticks:
									{
										minRotation: 0
										, maxRotation: 0
										, autoSkip: true
										, callback:
											(value: string) => {
												if (value === "-") {
													return "";
												}
												else {
													return value.toLocaleString() + "km";
												}
											}
									}
								}
							]
							,
							yAxes: [
								{
									ticks:
									{
										minRotation: 0
										, maxRoDtation: 0
										, autoSkip: true
										, callback:
											(value: string) => {
												return value.toLocaleString() + " m";
											}
									}
								}
							]
						}
						, legend:
						{
							display: false
						}
						, hover:
						{
							mode: "nearest"
							, intersect: false
						}
						, tooltips:
						{
							enabled: true
							, mode: "nearest"
							, callbacks:
							{
								title:
									(i: any[], data: {}) => {
										return "";
									}
								, label:
									(i: any[], data: {}) => {
										return "";
									}
								, afterBody:
									(i: any[], data: {}) => {
										return _this.eChartToolTipData(i, data);
									}
							}
						}
						, onHover:
							(e: {}, i: any[]) => {
								return _this.eChartHover(e, i);
							}

						, onClick:
							(e: {}, i: any[]) => {
								return _this.eChartClick(e, i);
							}
					}
				}
			);
			// -> ChartJS - JavaScript
		}


		if (fCreate) {
			this.o.append(this.oChart);
			if(this.o.parentElement && this.oScreen) {
				this.o.parentElement.append(this.oScreen);
			}
		}
	}

	/**
	 * イベント：HoverOut
	 * @param e MouseEvent
	 */
	private eHoverOut(e: {}) {
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
	private eChartHover(e: {}, i: ChartIndex[]): boolean {
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
	private eChartHoverCallback(i: ChartIndex) {
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
	private eChartClick(e: {}, i: ChartIndex[] | null): boolean {
		this.fScreen = !this.fScreen;

		let vDisplay: string = "none";
		let vMode: string | null = "nearest";
		if (this.fScreen) {
			vDisplay = "block";
			vMode = null;
		}
		this.oChartCanvasData.options.hover.mode = vMode;
		this.oChartCanvasData.update();

		if (i !== null) {
			if (i.length > 0) {
				let _i: ChartIndex = i[0];
				this.oChartCanvasData.tooltip._active_datasetIndex = _i._datasetIndex;
				this.oChartCanvasData.tooltip._active_index = _i._index;
			}

			if (typeof this.oChartCanvasData.tooltip._active_index === "number"
				&&
				typeof this.oChartCanvasData.tooltip._active_datasetIndex === "number"
			) {
				let _i: ChartIndex = new ChartIndex();
				_i._index = this.oChartCanvasData.tooltip._active_index;
				_i._datasetIndex = this.oChartCanvasData.tooltip._active_datasetIndex;
				this.toolTip(_i);
			}
		}

		if(this.oScreen) {
			this.oScreen.style.display = vDisplay;
		}

		return false;
	}

	/**
	 * ツールチップ
	 * @param データインデックス
	 */
	private toolTip(i: ChartIndex | null) {
		if (this.oChartCanvasData !== null) {
			let fOpen: boolean = false;
			let iData: number | null = null;
			let iDataSet: number | null = null;
			if (!this.oChartCanvasData.tooltip._active) {
				this.oChartCanvasData.tooltip._active = new Array();
			}
			if (i === null) {
				if (typeof this.oChartCanvasData.tooltip._active_index === "number"
					&&
					typeof this.oChartCanvasData.tooltip._active_datasetIndex === "number"
				) {
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
				iDataSet !== null
			) {
				let vData = this.oChartCanvasData.getDatasetMeta(iDataSet).data[iData];

				let fSingle: boolean = true;

				// ツールチップ：単一
				if (fSingle) {
					if (fOpen) {
						this.oChartCanvasData.tooltip._active = [];
					}
				}
				// ツールチップ：複数
				this.oChartCanvasData.tooltip._active.some((o: any, n: number, data: any) => {
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
	private toolTipDraw(i: ChartIndex | null) {
		// 描画処理：呼び出し
		if (i === null) {
			if (this.vChartCanvasData_DrawTM !== null) {
				clearTimeout(this.vChartCanvasData_DrawTM);
				this.vChartCanvasData_DrawTM = null;
			}

			this.vChartCanvasData_DrawTM = setTimeout(
				(o: mapsDataGpxChart) => {
					if (o.oChartCanvasData_Active !== null) {
						o.toolTipDraw(this.oChartCanvasData_Active);
					}
				}
				, 300
				, this
			);
		}
		else {
			// 設定
			if (i !== null
				&& typeof i.init === "boolean"
			) {
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
	private eChartToolTipData(i: ChartIndex[], data: {}): string[] {
		return this.eChartToolTipDataLog(i[0]).text;
	}

	/**
	 * ツールチップ：データ
	 * @param i データインデックス
	 * @returns データ
	 */
	private eChartToolTipDataLog(i: ChartIndex): mapsDataGpxChartData {
		let ret: mapsDataGpxChartData = new mapsDataGpxChartData();

		if(this.data) {
			let dataLogs: mapsDataGpxLog[] = this.data.getLogs();
			let dataLog: mapsDataGpxLog = dataLogs[i.index];

			let incline: string = "";
			let direction: string = "";
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
	public refresh(w: number, h: number, wx: number) {
		let n = Math.floor(w / wx);
		w = wx * n;
		n += 1;

		if(this.oChart) {
			this.oChart.style.width = w + "px";
			this.oChart.style.height = h + "px";
			if(this.oScreen) {
				this.oScreen.style.width = w + "px";
				this.oScreen.style.height = h + "px";
				this.oScreen.style.top = this.oChart.offsetTop + "px";
				this.oScreen.style.left = this.oChart.offsetLeft + "px";
			}
		}

		this.oChartCanvasData.options.scales.xAxes[0].ticks.maxTicksLimit = n;
		this.oChartCanvasData.update();

		if(this.oChartCanvas) {
			this.oChartCanvas.style.display = "block";
		}

		this.toolTipDraw(null);
	}

	/** 選択
	 * @time 時間
	 */
	public selectTime(time: Date) {
		this.fScreen = false;
		let i: ChartIndex = new ChartIndex();

		if(this.data) {
			this.data.getLogs().some((o: mapsDataGpxLog, n: number, data: mapsDataGpxLog[]) => {
				if (o.time === time) {
					this.fScreen = true;
				}
				else {
					if(this.data) {
						let timeGPX_S: Date | null = o.time;
						let timeGPX_E: Date | null = o.time;

						if(timeGPX_S) {
							timeGPX_S.setSeconds(timeGPX_S.getSeconds() - this.data.getlogsTMS());
						}
						if(timeGPX_E) {
							timeGPX_E.setSeconds(timeGPX_E.getSeconds() + this.data.getlogsTMS());
						}

						if(timeGPX_S && timeGPX_E) {
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

	/* イベント設定：ホバー
	 * args
	 *  Object eHover : コールバック関数
	 */
	public setEventHover = (fnc: Function) => {
		if (this.fChartHoverCallback !== fnc) {
			this.fChartHoverCallback = fnc;
		}
	}
}

/**
 * 地図：データ：Garmin GPSログ(GPX)：標高図 -> データ
 */
class mapsDataGpxChartData {
	/**
	 * データ
	 */
	public data: mapsDataGpxLog | null = null;

	/**
	 * テキスト
	 */
	public text: string[] = [];
}