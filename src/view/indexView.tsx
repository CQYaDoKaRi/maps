// npm install --save-dev @types/react
/// <reference path="../../node_modules/@types/react/index.d.ts" />
// npm install --save-dev @types/react-dom
/// <reference path="../../node_modules/@types/react-dom/index.d.ts" />

/// <reference path="./indexViewMenu.tsx" />
/// <reference path="./indexViewContents.tsx" />

/**
 * indexView
 */
class indexView {
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