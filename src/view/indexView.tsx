// npm install --save-dev react @types/react
import React from "react";
// npm install --save-dev react-dom @types/react-dom
import ReactDOM from "react-dom";
// npm install --save-dev react-redux @types/react-redux
import { Provider } from "react-redux";

import View from "./View";
import { ViewMenuTitle } from "./ViewMenu";

import store, { storeDispatchMenu, storeGetMenuKey } from "./RStore";

/**
 * indexView
 */
export class indexView {
	private init: { [key: string]: boolean } = {};
	private titleData: ViewMenuTitle[] = [];

	/**
	 * 表示/非表示
	 * @param key タイトルキー
	 */
	public display(key: string): void {
		this.titleData.map((item: ViewMenuTitle) => {
			let disp = "none";
			if (item.key === key) {
				disp = "block";
			}
			const oDiv: HTMLElement | null = document.getElementById(item.key);
			if (oDiv) {
				oDiv.style.display = disp;
			}
		});
	}

	/**
	 * ステータス
	 * @param key タイトルキー
	 * @param tkey ターゲットタイトルキー
	 * @returns 処理ステータス
	 */
	public status(key: string, tkey: string): boolean {
		let ret = true;
		const item: ViewMenuTitle | undefined = this.titleData.find((item: ViewMenuTitle) => item.key === key);
		if (item && item.key === tkey) {
			ret = this.init[item.key];
			this.init[item.key] = true;
		}
		return ret;
	}

	/**
	 * 取得：メニュー - タイトル
	 * @param key タイトルキー
	 * @returns タイトル
	 */
	public getMenuTitle(key: string): string {
		const item: ViewMenuTitle | undefined = this.titleData.find((item: ViewMenuTitle) => item.key === key);
		return item ? item.title : "";
	}

	/**
	 * 設定：メニュー - タイトル
	 * @param item タイトル
	 */
	public setMenuTitle(item: ViewMenuTitle): void {
		this.titleData.push(item);
		this.init[item.key] = false;
	}

	/**
	 * イベント
	 */
	private evt(): void {
		window.location.hash = `#${storeGetMenuKey()}`;
	}

	/**
	 * 描画 - App
	 * @param container Div
	 * @param titleKey タイトルキー
	 */
	public renderApp(container: HTMLElement | null, key: string): void {
		// 初期値
		if (!key) {
			key = this.titleData.length > 0 ? this.titleData[0].key : "";
		}
		if (container) {
			store.subscribe(() => {
				this.evt();
			});

			storeDispatchMenu(key);

			ReactDOM.render(
				<Provider store={store}>
					<View titleData={this.titleData} />
				</Provider>,
				container
			);
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
	module.exports.indexView = indexView;
}
