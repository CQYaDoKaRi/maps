import {Feature, Geometry} from "geojson";
import L from "leaflet";

export class appMapsGeoJSON {
	private url: string = "";
	private layer: L.GeoJSON | null = null;
	private layerVisible: boolean = false;

	/**
	 * コンストラクター
	 * @param url geojson
	 */
	constructor(url: string) {
		this.url = url;
	}

	/**
	 * 取得
	 * @param url geojson
	 * @returns Promise<void>
	 */
	private get(url: string): Promise<void> {
		return new Promise<void>((resolve: (data: any) => void, reject: (reson: any) => void) => {
			fetch(url,
				{
					method: "GET"
				}
			).then(res => {
				if (res.status === 200) {
					res.text().then(text => {
						if (text.length > 0) {
							resolve(JSON.parse(text));
						}
						else{
							resolve({});
						}
					}
					);
				}
				else {
					resolve({});
				}
			}
			).catch(error => {
				resolve({});
			}
			);
		}
		);
	}

	/**
	 * 設定
	 * @param oMap leaflet
	 */
	public set(oMap: L.Map): void {
		if (this.layer) {
			this.layer.addTo(oMap);
			this.layerVisible = true;
		}
		else {
			this.get(this.url).then((data: any) => {
				if (!data) {
					return;
				}
				const options: L.GeoJSONOptions = {
					style: {
						color: "#000000"
						, weight: 1
						, opacity: 0.80
					}
					, onEachFeature: (feature: Feature<Geometry, any>, layer: any) => {
						let pref: number = 0;
						let name: string = "";

						// pref & prefCitry
						if (feature.properties) {
							if (feature.properties.pref) {
								pref = feature.properties.pref;
								name = feature.properties.name;
							}
							else if (feature.properties.JCODE) {
								pref = +feature.properties.JCODE.substring(0, 2);
								const name_gun = feature.properties.GUN ? feature.properties.GUN : "";
								const name_shikuchoson = feature.properties.SIKUCHOSON ? feature.properties.SIKUCHOSON : "";
								name = feature.properties.KEN + name_gun + name_shikuchoson;
							}

							let color: string = "";
							// 北海道
							if (pref === 1) {
								color = "#68cbc6";
							}
							// 東北
							else if (pref >= 2 && pref <= 7) {
								color = "#81d6eb";
							}
							// 関東
							else if (pref >= 8 && pref <= 14) {
								color = "#7595ec";
							}
							// 北陸
							else if (pref >= 15 && pref <= 18) {
								color = "#af6ec2";
							}
							// 中部
							else if (pref >= 19 && pref <= 23) {
								color = "#da6ea2";
							}
							// 近畿
							else if (pref >= 24 && pref <= 30) {
								color = "#eea849";
							}
							// 中国
							else if (pref >= 31 && pref <= 35) {
								color = "#e7d31a";
							}
							// 四国
							else if (pref >= 36 && pref <= 39) {
								color = "#aed44b";
							}
							// 九州
							else if (pref >= 40 && pref <= 46) {
								color = "#6eb318";
							}
							// 沖縄
							else if (pref === 47) {
								color = "#2e9f5f";
							}

							if (color) {
								layer.setStyle(
									{ color: color }
								);
							}
							if (name) {
								layer.bindPopup(name);
							}
						}
					}
				}

				this.layer = L.geoJSON(data, options);
				this.layer.addTo(oMap);
				this.layerVisible = true;
			});
		}
	}

	/**
	 * 削除
	 * @param pMap leaflet
	 */
	public remove(oMap: L.Map): void {
		if (this.layer && this.layerVisible) {
			oMap.removeLayer(this.layer);
			this.layerVisible = false;
		}
	}
}