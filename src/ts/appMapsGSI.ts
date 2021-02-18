import { maps, mapsTile } from "./maps";

/**
 * 地理院タイル
 */
export class appMapsGSI {
	private oMaps: maps | null = null;
	private oDiv: HTMLElement | null = null;
	private oImg: HTMLImageElement[] = [];
	private oImgPos: mapsTile[] = [];
	private n = 0;

	/**
	 * constructor
	 * @param oMaps
	 */
	constructor(oMaps: maps) {
		this.oMaps = oMaps;
	}

	/**
	 * 設定：DIV
	 * @param o Divオブジェクト
	 */
	public setDiv(o: HTMLElement): void {
		this.oDiv = o;
		this.oImg = [];
		this.oImgPos = [];
		this.n = 0;
	}

	/**
	 * 設定：タイル
	 * @param o タイル画像オブジェクト
	 * @param pos タイル座標情報
	 */
	public setTile(o: HTMLImageElement, pos: mapsTile): void {
		this.oImg.push(o);
		this.oImgPos.push(pos);
	}

	/**
	 * シンボル生成
	 * @param w シンボル幅[px]
	 * @param h シンボル高[px]
	 */
	public Symbol(w: number, h: number): void {
		this.n++;
		if (this.oImg.length === this.n) {
			this.oImg.map((o: HTMLImageElement, n: number) => {
				const vImgR: ClientRect = o.getBoundingClientRect();

				const vImgY: number = vImgR.top + window.pageYOffset;
				const vImgX: number = vImgR.left + window.pageXOffset;
				const oImgP: HTMLElement = document.createElement("div");
				oImgP.innerHTML = "▲";
				oImgP.style.fontSize = "24px";
				oImgP.style.color = "#FF0000";
				oImgP.style.position = "absolute";
				oImgP.style.top = `${vImgY + this.oImgPos[n].px_y - w * 0.5}px`;
				oImgP.style.left = `${vImgX + this.oImgPos[n].px_x - h * 0.5}px`;

				if (this.oDiv) {
					this.oDiv.append(oImgP);
				}
			});
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
	module.exports.appMapsGSI = appMapsGSI;
}
