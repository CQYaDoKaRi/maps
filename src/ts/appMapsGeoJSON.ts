import {Feature, GeoJsonObject, Geometry} from 'geojson';
import L from 'leaflet';

interface FeatureGeometry{
	type: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	coordinates: any
}

interface apiResponsePointInPolygon{
	name: string
	, lat: number
	, lon: number
}

export class appMapsGeoJSON {
	private url = '';
	private layer: L.GeoJSON | null = null;
	private layerVisible = false;
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return new Promise<void>((resolve: (data: any) => void) => {
			fetch(url,
				{
					method: 'GET'
				}
			).then(
				res => {
					if (res.status === 200) {
						void res.text().then(
							(text: string) => {
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
			).catch(
				() => {
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
			void this.get(this.url).then(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(data: any) => {
					if (!data) {
						return;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const dGeojson: GeoJsonObject = data;
					const options: L.GeoJSONOptions = {
						style: {
							color: '#000000'
							, weight: 1
							, opacity: 0.80
						}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						, onEachFeature: (feature: Feature<Geometry, any>, layer: L.GeoJSON) => {
							if (!feature.properties) {
								return;
							}

							let pref = 0;
							// - pref
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							if (feature.properties.pref) {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
								pref = +feature.properties.pref;
							}
							// - prefCity
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							else if (feature.properties.JCODE) {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
								const jcode: string = feature.properties.JCODE;
								pref = +jcode.substring(0, 2);
							}
							layer.setStyle(
								{
									color: this.setStyleColor(pref)
								}
							);

							this.setAttr(oMap, feature, layer);
						}
					}

					this.layer = L.geoJSON(dGeojson, options);
					this.layer.addTo(oMap);
					this.layerVisible = true;
				}
			);
		}
	}

	/**
	 * 設定：Style：Color
	 * @param pref 都道府県コード
	 * @returns 色
	 */
	private setStyleColor(pref: number): string{
		// 北海道
		if (pref === 1) {
			return '#68cbc6';
		}
		// 東北
		else if (pref >= 2 && pref <= 7) {
			return '#81d6eb';
		}
		// 関東
		else if (pref >= 8 && pref <= 14) {
			return '#7595ec';
		}
		// 北陸
		else if (pref >= 15 && pref <= 18) {
			return '#af6ec2';
		}
		// 中部
		else if (pref >= 19 && pref <= 23) {
			return '#da6ea2';
		}
		// 近畿
		else if (pref >= 24 && pref <= 30) {
			return '#eea849';
		}
		// 中国
		else if (pref >= 31 && pref <= 35) {
			return '#e7d31a';
		}
		// 四国
		else if (pref >= 36 && pref <= 39) {
			return '#aed44b';
		}
		// 九州
		else if (pref >= 40 && pref <= 46) {
			return '#6eb318';
		}
		// 沖縄
		else if (pref === 47) {
			return '#2e9f5f';
		}
		return '#000000';
	}

	/**
	/**
	 * 設定：属性
	 * @param oMap leaflet
	 * @param feature 属性情報
	 * @param layer レイヤー
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public setAttr(oMap: L.Map, feature: Feature<Geometry, any>, layer: L.GeoJSON): void {
		if (!oMap) {
			return;
		}

		let name = '';
		let tname = '';
		let fMarker = false;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (feature.properties.pref) {
			tname = '都道府県';

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			name = feature.properties.name;
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		else if (feature.properties.JCODE) {
			tname = '市区町村';

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const name_ken: string = feature.properties.KEN ? feature.properties.KEN : '';
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const name_gun: string = feature.properties.GUN ? feature.properties.GUN : '';
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const name_shikuchoson: string = feature.properties.SIKUCHOSON ? feature.properties.SIKUCHOSON : '';
			name = `${name_ken}${name_gun}${name_shikuchoson}`;
			fMarker = true;
		}
		const id = `l_popup_attr_${Math.random()}`;
		name = `<div id='${id}'>${name}</div>`;
		layer.bindPopup(
			name
			, {
				minWidth: 100
			}
		).on('popupopen', () => {
			this.markerRemove();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			void this.attr(feature.geometry).then((data: any) => {
				const o: HTMLElement | null = L.DomUtil.get(id);
				if (o) {
					let n = 0;
					if (data) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						const items: apiResponsePointInPolygon[] = data;
						items.map((item: apiResponsePointInPolygon) => {
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
	 * 属性
	 * @param geometry 空間情報
	 * @returns Promise<void>
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private attr(geometry: FeatureGeometry | any): Promise<void> {
		const url = 'api/maps/mongo/postoffice/inpolygon';

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const gcoordinates: [] = this.attrGeometoryCoordinatesDuplicateDelete(geometry);

		const params: URLSearchParams = new URLSearchParams();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		params.append('gtype', geometry.type);
		params.append('gcoordinates', JSON.stringify(gcoordinates));
		params.append('n', '0');

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return new Promise<void>((resolve: (data: any) => void) => {
			fetch(url,
				{
					method: 'POST'
					, body: params
				}
			).then(
				res => {
					if (res.status === 200) {
						void res.text().then(
							(text: string) => {
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
			).catch(
				() => {
					resolve([]);
				}
			);
		}
		);
	}

	/**
	 * 属性：空間情報 - 重複座標削除
	 * @param geometry 空間情報
	 * @returns 空間情報
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private attrGeometoryCoordinatesDuplicateDelete(geometry: FeatureGeometry): any{
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
		const gcoordinates: any = geometry.coordinates;

		if (geometry.type === 'Polygon') {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			gcoordinates[0] = gcoordinates[0].filter((e1: number[], index1: number) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				return !gcoordinates[0].some((e2: number[], index2: number) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					return index1 < index2 && e1[0] === e2[0] && e1[1] === e2[1];
				});
			});
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			gcoordinates[0].push(gcoordinates[0][0]);
		}
		else if (geometry.type === 'MultiPolygon') {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			for (let i = 0; i < gcoordinates[0].length; i++) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				gcoordinates[0][i] = gcoordinates[0][i].filter((e1: number[], index1: number) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
					return !gcoordinates[0][i].some((e2: number[], index2: number) => {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						return index1 < index2 && e1[0] === e2[0] && e1[1] === e2[1];
					});
				});
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			gcoordinates[0][i].push(gcoordinates[0][i][0]);
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return gcoordinates;
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