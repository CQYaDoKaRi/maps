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
				this.layer = L.geoJSON(data, {});
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