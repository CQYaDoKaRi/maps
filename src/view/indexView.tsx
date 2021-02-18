// npm install --save-dev react @types/react
import React from "react";
// npm install --save-dev react-dom @types/react-dom
import ReactDOM from "react-dom";

import { IndexViewMenu, indexMenuTitle } from "./indexViewMenu";
import { IndexViewContents } from "./indexViewContents";

/**
 * indexView
 */
export class indexView {
	private init: { [key: string]: boolean } = {};
	private title: indexMenuTitle[] = [];

	/**
	 * 表示/非表示
	 * @param key タイトルキー
	 */
	public display(key: string): void{
		this.title.map((item: indexMenuTitle) => {
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
	public status(key: string, tkey: string): boolean{
		let ret = true;
		const item: indexMenuTitle | undefined = this.title.find((item: indexMenuTitle) => item.key === key);
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
	public getMenuTitle(key: string): string{
		const item: indexMenuTitle | undefined = this.title.find((item: indexMenuTitle) => item.key === key);
		return item ? item.title : "";
	}

	/**
	 * 設定：メニュー - タイトル
	 * @param item タイトル
	 */
	public setMenuTitle(item: indexMenuTitle): void{
		this.title.push(item);
		this.init[item.key] = false;
	}

	/**
	 * 描画 - メニュー
	 * @param container Div
	 */
	public renderMenu(container: HTMLElement | null): void{
		if (container) {
			ReactDOM.render(
				<IndexViewMenu titles={this.title} />
				, container
			);
		}
	}

	/**
	 * 描画 - コンテンツ
	 * @param container Div
	 */
	public renderContents(container: HTMLElement | null): void{
		if (container) {
			ReactDOM.render(
				<IndexViewContents />
				, container
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