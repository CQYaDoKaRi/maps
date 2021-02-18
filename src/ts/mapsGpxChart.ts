/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { mapsDataGpx, mapsDataGpxLog } from "./maps";
// npm install --save-dev chart.js @types/chart.js
import { Chart, ChartOptions, ChartTooltipItem } from "chart.js";

/**
 * ChartJS.Index
 */
export class ChartIndex {
	public init = false;

	public index = 0;
	public datasetIndex = 0;

	public _index = 0;
	public _datasetIndex = 0;

	public _active_index = 0;
	public _active_datasetIndex = 0;
}

/**
 * 地図：データ：Garmin GPSログ(GPX)：標高図
 */
export class mapsDataGpxChart {
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
	private fScreen = false;

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
	private oChartCanvasData: Chart | null = null;

	/**
	 * 標高図：図：データ
	 */
	private vChartCanvasData: number[] = [];
	private vChartCanvasDataLabels: string[] = [];
	private vChartCanvasDataLabelsDistance: string[] = [];

	/**
	 * 標高図：図：Activeデータインデックス：データ
	 */
	private dChartCanvasDataToolTip: {
		current: ChartIndex;
		data: ChartIndex[];
	} = {
		current: new ChartIndex(),
		data: [],
	};

	/**
	 * 標高図：イベント：ホバー：コールバック関数
	 */
	private fChartHoverCallback: (data: mapsDataGpxChartData) => void;

	/**
	 * constructor
	 * @param o Div Object
	 * @param data : GPXデータ
	 */
	constructor(o: HTMLElement, data: mapsDataGpx) {
		this.o = o;
		this.data = data;

		this.dChartCanvasDataToolTip.current._datasetIndex = -1;
		this.dChartCanvasDataToolTip.current._index = -1;

		// 初期化用コールバック関数
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.fChartHoverCallback = (data: mapsDataGpxChartData) => {
			return;
		};

		this.create();
	}

	/**
	 * 生成
	 */
	public create(): void {
		if (!this.o) {
			return;
		}

		this.o.innerHTML = "";

		if (this.oChart) {
			return;
		}

		if (this.data) {
			this.data.getLogs().map((log: mapsDataGpxLog) => {
				this.vChartCanvasData.push(log.e);
				this.vChartCanvasDataLabels.push(`${Math.ceil(log.distance / 1000)}`);
				this.vChartCanvasDataLabelsDistance.push(`${Math.ceil(log.distance * 1000) / 1000}`);
			});
		}

		this.oScreen = document.createElement("div");
		this.oScreen.style.position = "absolute";
		this.oScreen.style.display = this.fScreen ? "block" : "none";
		this.oScreen.style.textAlign = "right";
		this.oScreen.innerHTML = '<i class="fas fa-thumbtack"></i>';
		this.oScreen.addEventListener("click", (e: MouseEvent) => {
			return this.eChartClick(e, null);
		});

		this.oChart = document.createElement("div");
		this.oChart.style.position = "relative";

		this.oChartCanvas = document.createElement("canvas");
		this.oChartCanvas.style.display = "none";
		this.oScreen.addEventListener("mouseout", (e: MouseEvent) => {
			return this.eHoverOut(e);
		});

		this.oChart.append(this.oChartCanvas);

		const oChartCanvas2D: CanvasRenderingContext2D | null = this.oChartCanvas.getContext("2d");
		if (oChartCanvas2D) {
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
							pointHoverRadius: 5,
						},
					],
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
									callback: (value: string) => {
										if (value === "-") {
											return "";
										} else {
											return value.toLocaleString() + " km";
										}
									},
								},
							},
						],
						yAxes: [
							{
								ticks: {
									minRotation: 0,
									maxRotation: 0,
									autoSkip: true,
									callback: (value: string) => {
										return value.toLocaleString() + " m";
									},
								},
							},
						],
					},
					legend: {
						display: false,
					},
					hover: {
						mode: "nearest",
						intersect: false,
					},
					tooltips: {
						enabled: true,
						mode: "nearest",
						callbacks: {
							title:
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								(i: ChartTooltipItem[], data: Chart.ChartData) => {
									return "";
								},
							label:
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								(i: ChartTooltipItem, data: Chart.ChartData) => {
									return "";
								},
							afterBody: (i: ChartTooltipItem[], data: Chart.ChartData) => {
								return this.eChartToolTipData(i, data);
							},
						},
					},
					onHover: (e: MouseEvent, i: ChartIndex[]) => {
						return this.eChartHover(e, i);
					},

					onClick: (e: MouseEvent, i: ChartIndex[]) => {
						return this.eChartClick(e, i);
					},
				},
			});
		}

		this.o.append(this.oChart);
		if (this.o.parentElement && this.oScreen) {
			this.o.parentElement.append(this.oScreen);
		}
	}

	/**
	 * イベント：HoverOut
	 * @param e MouseEvent
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private eHoverOut(e: MouseEvent): void {
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
	private eChartHover(e: MouseEvent, i: ChartIndex[]): boolean {
		if (!this.fScreen) {
			if (i.length > 0) {
				this.toolTip(i[0]);
			}
		}

		return true;
	}

	/**
	 * イベント：Chart - Hover - callback
	 * @param i データインデックス
	 */
	private eChartHoverCallback(i: ChartTooltipItem): void {
		if (this.fChartHoverCallback !== null) {
			this.fChartHoverCallback(this.eChartToolTipDataLog(i));
		}
	}

	/**
	 * イベント：Chart - Click
	 * @param e MouseEvent
	 * @param i データインデックス
	 * @returns イベントステータス
	 */
	private eChartClick(e: MouseEvent, i: ChartIndex[] | null): boolean {
		this.fScreen = !this.fScreen;

		if (this.oChartCanvasData) {
			const options: ChartOptions = this.oChartCanvasData.options;
			if (options.hover) {
				options.hover.mode = this.fScreen ? undefined : "nearest";
			}
		}

		if (i) {
			this.toolTip(i[0]);
		}

		if (this.oScreen) {
			this.oScreen.style.display = this.fScreen ? "block" : "none";
		}

		return false;
	}

	/**
	 * ツールチップ
	 * @param データインデックス
	 */
	private toolTip(i: ChartIndex | null): void {
		if (!this.oChartCanvasData) {
			return;
		}

		// CharJS - 内部データ操作
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const oChart: any = this.oChartCanvasData;
		// CharJS - 内部データ操作 - ToolTip - active
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const oChartToolTipActive: ChartIndex = oChart.tooltip._active;

		let fOpen = false;
		let iData = -1;
		let iDataSet = -1;
		if (!oChart.tooltip._active) {
			oChart.tooltip._active = [];
		}
		if (i === null) {
			// CharJS - 内部データ操作 - ToolTip - active のデータ取得
			if (typeof oChartToolTipActive._index === "number" && typeof oChartToolTipActive._datasetIndex === "number") {
				iData = oChartToolTipActive._index;
				iDataSet = oChartToolTipActive._datasetIndex;
				this.setToolTipIndex(oChartToolTipActive);
			}
		} else {
			fOpen = true;
			iData = i._index;
			iDataSet = i._datasetIndex;
		}
		if (iData < 0 || iDataSet < 0) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let vData: any | null = this.oChartCanvasData.getDatasetMeta(iDataSet).data[iData];

		const fSingle = true;

		// ツールチップ：単一
		if (fSingle) {
			if (fOpen) {
				// CharJS - 内部データ操作 - ToolTip - active
				oChart.tooltip._active = [];
				this.dChartCanvasDataToolTip.data = [];
			}
		}
		// ツールチップ：複数
		this.dChartCanvasDataToolTip.data.some((o: ChartIndex, n: number, data: ChartIndex[]) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (o._index === vData._index) {
				if (fOpen) {
					vData = null;
				} else {
					data.splice(n, 1);
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
				// CharJS - 内部データ操作 - ToolTip - active
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				oChart.tooltip._active.push(vData);
				this.dChartCanvasDataToolTip.data.push(vData);
			}
			this.setToolTipIndex(i);
		}

		if (this.oChartCanvasData) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			oChart.tooltip.update(true);
		}

		// コールバック処理
		const toolTipItem: ChartTooltipItem = {
			index: i._index,
			datasetIndex: i._datasetIndex,
		};
		this.eChartHoverCallback(toolTipItem);
	}

	/**
	 * 設定：ツールチップンデックス
	 * @param i ツールチップンデックス
	 */
	private setToolTipIndex(i: ChartIndex): void {
		this.dChartCanvasDataToolTip.current._datasetIndex = i._datasetIndex;
		this.dChartCanvasDataToolTip.current._index = i._index;
	}

	/**
	 * 取得：ツールチップンデックス
	 * @returns ツールチップンデックス
	 */
	private getToolTipIndex(): ChartIndex | null {
		if (this.dChartCanvasDataToolTip.current._datasetIndex >= 0 && this.dChartCanvasDataToolTip.current._index >= 0) {
			const i: ChartIndex = new ChartIndex();
			i._index = this.dChartCanvasDataToolTip.current._index;
			i._datasetIndex = this.dChartCanvasDataToolTip.current._datasetIndex;
			return i;
		}

		return null;
	}

	/**
	 * ツールチップ：データ
	 * @param i データインデックス
	 * @param data データ.datasets, labels
	 * @returns ツールチップ
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private eChartToolTipData(i: ChartTooltipItem[], data: Chart.ChartData): string[] {
		if (i.length > 0) {
			return this.eChartToolTipDataLog(i[0]).text;
		} else {
			return [];
		}
	}

	/**
	 * ツールチップ：データ
	 * @param i データインデックス
	 * @returns データ
	 */
	private eChartToolTipDataLog(i: ChartTooltipItem): mapsDataGpxChartData {
		const ret: mapsDataGpxChartData = new mapsDataGpxChartData();
		if (this.data) {
			const dataLogs: mapsDataGpxLog[] = this.data.getLogs();
			if (i.index) {
				const dataLog: mapsDataGpxLog = dataLogs[i.index];

				let incline = "";
				let direction = "";
				if (dataLog.distanceText !== "") {
					incline = `${dataLog.incline}`;
					direction = `${dataLog.direction}°(${dataLog.directionName})`;
				}

				ret.data = dataLog;

				ret.text.push(`時間：${dataLog.timeFormatJP}`);
				ret.text.push(`距離：${dataLog.distanceText}`);
				ret.text.push(`緯度：${dataLog.lat}`);
				ret.text.push(`経度：${dataLog.lon}`);
				ret.text.push(`標高：${dataLog.e.toLocaleString()} m`);
				ret.text.push(`勾配：${incline}`);
				ret.text.push(`速度：${dataLog.speed} km/h`);
				ret.text.push(`方向：${direction}`);
			}
		}

		return ret;
	}

	/** 描画
	 *  @param w  幅[px]
	 *  @param h  高[px]
	 *  @param wx 横グリッド幅[px]
	 */
	public refresh(w: number, h: number, wx: number): void {
		let n = Math.floor(w / wx);
		w = wx * n;
		n += 1;

		if (this.oChart) {
			this.oChart.style.width = `${w}px`;
			this.oChart.style.height = `${h}px`;
			if (this.oScreen) {
				this.oScreen.style.width = `${w}px`;
				this.oScreen.style.height = `${h}px`;
				this.oScreen.style.top = `${this.oChart.offsetTop}px`;
				this.oScreen.style.left = `${this.oChart.offsetLeft}px`;
			}
		}

		if (this.oChartCanvasData) {
			const options: ChartOptions = this.oChartCanvasData.options;
			if (options.scales && options.scales.xAxes && options.scales.xAxes[0] && options.scales.xAxes[0].ticks) {
				options.scales.xAxes[0].ticks.maxTicksLimit = n;
			}
			this.oChartCanvasData.update();
		}

		if (this.oChartCanvas) {
			this.oChartCanvas.style.display = "block";
		}

		this.toolTip(this.dChartCanvasDataToolTip.current);
	}

	/** 選択
	 * @param time 時間
	 */
	public selectTime(time: Date): void {
		this.fScreen = false;
		const i = new ChartIndex();

		if (this.data) {
			this.data.getLogs().some((o: mapsDataGpxLog, n: number) => {
				if (o.time === time) {
					this.fScreen = true;
				} else {
					if (this.data) {
						const timeGPX_S: Date | null = o.time;
						const timeGPX_E: Date | null = o.time;

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
		} else {
			this.toolTip(null);
		}

		this.toolTip(i);
	}

	/**
	 * イベント設定：ホバー
	 * @param fnc コールバック関数
	 */
	public setEventHover(fnc: (data: mapsDataGpxChartData) => void): void {
		if (this.fChartHoverCallback !== fnc) {
			this.fChartHoverCallback = fnc;
		}
	}
}

/**
 * 地図：データ：Garmin GPSログ(GPX)：標高図 -> データ
 */
export class mapsDataGpxChartData {
	/**
	 * データ
	 */
	public data: mapsDataGpxLog | null = null;

	/**
	 * テキスト
	 */
	public text: string[] = [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface module {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.ChartIndex = ChartIndex;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.mapsDataGpxChart = mapsDataGpxChart;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.mapsDataGpxChartData = mapsDataGpxChartData;
}
