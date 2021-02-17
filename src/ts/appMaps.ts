/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// npm install --save-dev @types/geojson
// npm install --save-dev leaflet @types/leaflet
// npm install --leaflet.awesome-markers @types/leaflet.awesome-markers
import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet/dist/leaflet.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import { appMapsGeoJSON } from "./appMapsGeoJSON";
/*
 * url-loader で bundle する場合：
 * ※DataUrl形式になるためオリジナルファイルよりもサイズが大きくなる
 * ※js サイズが大きくなるためオーバーヘッドが増える
 */
/*
import leafletIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import leafletIconUrl from "leaflet/dist/images/marker-icon.png";
import leafletShadowUrl from "leaflet/dist/images/marker-shadow.png"

// leaflet：デフォルトアイコンを定義し webpack に png 画像を bundle させる
L.Icon.Default.mergeOptions(
	{
		iconRetinaUrl: leafletIconRetinaUrl
		, iconUrl: leafletIconUrl
		, shadowUrl: leafletShadowUrl
	}
);
*/

/**
 * アプリケーション：地図
 */
export class appMaps {
	private oMap: L.Map | null = null;
	private iMapApp = "";
	private oMapApp: HTMLElement | null = null;

	private lat = 0;
	private lon = 0;
	private z = 0;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private options: any = {};

	private dPref: appMapsGeoJSON = new appMapsGeoJSON("./data/dPref.geojson");
	private dPrefCity: appMapsGeoJSON = new appMapsGeoJSON("./data/dPrefCity.geojson");

	/**
	 * コンストラクター
	 * @param i div
	 * @param lat 緯度
	 * @param lon 経度
	 * @param z ズームレベル
	 * @param options leaflet のオプション
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	constructor(i: string, lat: number, lon: number, z: number, options: any) {
		this.iMapApp = i;
		this.oMapApp = document.getElementById(this.iMapApp);
		if (!this.oMapApp) {
			return;
		}

		const mapOptions: L.MapOptions = {
			// ズームレベル制限：最小
			minZoom: 4
			// 表示範囲制限：左上, 右下
			, maxBounds: [
				[45.55722222, 122.93250000]
				,[20.42527777, 153.98666666]
			]
		}

		this.oMap = L.map(this.iMapApp, mapOptions);
		this.lat = lat;
		this.lon = lon;
		this.z = z;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.options = options;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (this.options.w) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
			this.oMapApp.style.width = `${this.options.w}${this.options.wUnit}`;
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (this.options.h) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-template-expressions
			this.oMapApp.style.height = `${this.options.h}${this.options.hUnit}`;
		}

		// スケール
		L.control.scale({imperial: false}).addTo(this.oMap);

		this.view(this.lat, this.lon, this.z);
	}

	/**
	 * 表示
	 * @param lat 緯度
	 * @param lon 経度
	 * @param z ズームレベル
	 */
	public view(lat: number, lon: number, z: number): void {
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resize(w: number, h: number): void {
		if(this.oMapApp) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
			this.oMapApp.style.width = `${this.options.w}px`;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
			this.oMapApp.style.height = `${this.options.h}px`;
		}
	}

	/**
	 * ポイント
	 * @param lat 緯度
	 * @param lon 経度
	 * @param options オプション
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	public point(lat: number, lon: number, options: any): void {
		if (!this.oMap) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (!options.color) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			options.color = "bule";
		}

		/*
		const _options = {
			prefix: "glyphicon"
			, icon: "lock"
			, markerColor: options.color
			, extraClasses: "glyphicons-custom"
		};
		*/
		const o = L.marker([lat, lon], { icon: L.AwesomeMarkers.icon(options) }).addTo(this.oMap);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (options.popup) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			o.bindPopup(options.popup);
		}
	}

	/**
	 * アーク
	 * @param coordinates 座標
	 * @param options オプション
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	public arc(coordinates: any, options: any): void {
		if (!this.oMap) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (!options.color) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			options.color = "bule";
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const o = L.polyline(coordinates, { color: options.color }).addTo(this.oMap);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (options.popup) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			o.bindPopup(options.popup);
		}
	}

	/**
	 * レイヤー：ベース（地理院地図）
	 */
	public layerBase(): void{
		if (!this.oMap) {
			return;
		}
		L.tileLayer(
			"https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
			, {
				attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>GSI</a>"
			}
		).addTo(this.oMap);
	}

	/**
	 * レイヤー：都道府県、市区町村界
	 */
	public layerPref(): void{
		if (!this.oMap) {
			return;
		}
		this.layerPrefEvtZoomEnd(null);
		this.oMap.on("zoomend",
			(e: L.LeafletEvent) => {
				this.layerPrefEvtZoomEnd(e);
			}
		);
	}

	/**
	 * レイヤー：都道府県、市区町村界：イベント：zoomend
	 * @param e
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private layerPrefEvtZoomEnd(e: L.LeafletEvent | null){
		if (!this.oMap) {
			return;
		}

		const z: number = this.oMap.getZoom();
		// 都道府県界
		if (z < 10) {
			this.dPrefCity.remove(this.oMap);
			this.dPref.set(this.oMap);
		}
		// 市区町村界
		else{
			this.dPref.remove(this.oMap);
			this.dPrefCity.set(this.oMap);
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface module {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.appMap = appMaps;
}