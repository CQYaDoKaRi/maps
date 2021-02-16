import {Feature, Geometry} from "geojson";
import L from "leaflet";

export class appMapsGeoJSON {
	private url: string = "";
	private layer: L.GeoJSON | null = null;
	private layerVisible: boolean = false;
	private markers: L.Marker[] = [];

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
					, onEachFeature: (feature: Feature<Geometry, any>, layer: L.GeoJSON) => {
						let pref: number = 0;

						// pref & prefCitry
						if (feature.properties) {
							if (feature.properties.pref) {
								pref = feature.properties.pref;
							}
							else if (feature.properties.JCODE) {
								pref = +feature.properties.JCODE.substring(0, 2);
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

							this.setAttr(oMap, feature, layer);
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
	 * 設定：属性
	 * @param oMap leaflet
	 */
	public setAttr(oMap: L.Map, feature: any, layer: L.GeoJSON): void {
		if (!oMap) {
			return;
		}

		let name: string = '';
		let tname: string = '';
		let fMarker: boolean = false;
		if (feature.properties.pref) {
			tname = '都道府県';
			name = feature.properties.name;
		}
		else if (feature.properties.JCODE) {
			tname = '市区町村';
			const name_gun = feature.properties.GUN ? feature.properties.GUN : "";
			const name_shikuchoson = feature.properties.SIKUCHOSON ? feature.properties.SIKUCHOSON : "";
			name = feature.properties.KEN + name_gun + name_shikuchoson;
			fMarker = true;
		}
		const id: string = 'l_popup_attr_' + Math.random();
		name = `<div id="${id}">${name}</div>`;
		layer.bindPopup(
			name
			, {
				 minWidth: 100
			}
		).on('popupopen', (e: L.PopupEvent) => {
			this.markerRemove();

			this.attr(feature, layer).then((data: any) => {
				const o: HTMLElement | null = L.DomUtil.get(id);
				if (o) {
					let n: number = 0;
					if (data) {
						data.map((item: any) => {
							n++;
							if (fMarker) {
								const oMarker = L.marker([item.lat, item.lon]).addTo(oMap);
								oMarker.bindPopup(`<table><tr><th>郵便局</th></tr><tr><td>${item.name}</td></tr></table>`);
								this.markers.push(oMarker);
							}
						}
						);
					}

					o.innerHTML = `<table><tr><th>${tname}</th></tr><tr><td>${name}</td></tr><tr><th>郵便局</th></tr><tr><td>${n}</td></tr></table>`;
				}
			}
			);
		}
		);
	}

	/**
	 * マーカー：削除
	 */
	public markerRemove(): void {
		this.markers.map((marker: L.Marker) => {
			marker.remove();
		});
	}

	/**
	 * 空間情報：重複座標削除
	 * @param geometry 空間情報
	 */
	private geoCoordinatesDuplicateDelete(geometry: any): any{
		let gcoordinates: any = geometry.coordinates;
		if (geometry.type === 'Polygon') {
			gcoordinates[0] = gcoordinates[0].filter(function(e1: any, index1: number){
			  return !gcoordinates[0].some(function(e2: any, index2: number){
				return index1 < index2 && e1[0] === e2[0] && e1[1] === e2[1];
			  });
			});
			gcoordinates[0].push(gcoordinates[0][0]);
		}
		else if (geometry.type === 'MultiPolygon') {
			for(let i: number = 0; i < gcoordinates[0].length; i++){
				gcoordinates[0][i] = gcoordinates[0][i].filter(function(e1: any, index1: number){
					return !gcoordinates[0][i].some(function(e2: any, index2: number){
					return index1 < index2 && e1[0] === e2[0] && e1[1] === e2[1];
					});
				});
				gcoordinates[0][i].push(gcoordinates[0][i][0]);
			}
		}

		return gcoordinates;
	}

	/**
	 * 属性
	 * @param url geojson
	 * @returns Promise<void>
	 */
	private attr(feature: any, layer: L.GeoJSON): Promise<void> {
		const url: string = 'api/maps/mongo/postoffice/inpolygon';

		const gcoordinates: any = this.geoCoordinatesDuplicateDelete(feature.geometry);

		const params: URLSearchParams = new URLSearchParams();
		params.append('gtype', feature.geometry.type);
		params.append('gcoordinates', JSON.stringify(gcoordinates));
		params.append('n', '0');

		return new Promise<void>((resolve: (data: any) => void, reject: (reson: any) => void) => {
			fetch(url,
				{
					method: "POST"
					, body: params
				}
			).then(res => {
				if (res.status === 200) {
					res.text().then(text => {
						if (text.length > 0) {
							resolve(JSON.parse(text));
						}
						else{
							resolve([]);
						}
					}
					);
				}
				else {
					resolve([]);
				}
			}
			).catch(error => {
				resolve([]);
			}
			);
		}
		);
	}

	/**
	 * 削除
	 * @param pMap leaflet
	 */
	public remove(oMap: L.Map): void {
		this.markerRemove();

		if (this.layer && this.layerVisible) {
			oMap.removeLayer(this.layer);
			this.layerVisible = false;
		}
	}
}