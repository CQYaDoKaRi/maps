// npm install --save-dev @types/react-dom
import React from "react"
// npm install --save-dev @types/react-dom
import ReactDOM from "react-dom";

import { IndexViewMenu, indexMenuTitle } from "./indexViewMenu";
import { IndexViewContents } from "./indexViewContents";

/**
 * indexView
 */
export class indexView {
	private title: indexMenuTitle[] = [];

	/**
	 * 設定：メニュー - タイトル
	 * @param item タイトル
	 */
	public setMenuTitle(item: indexMenuTitle): void{
		this.title.push(item);
	}

	/**
	 * 描画 - メニュー
	 * @param container Div
	 */
	public renderMenu(container: HTMLElement | null){
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
	public renderContents(container: HTMLElement | null){
		if (container) {
			ReactDOM.render(
				<IndexViewContents />
				, container
			);
		}
	}
}

interface module {
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	module.exports.indexView = indexView;
}