/**
 * アプリケーション
 */
export class app {
	private SCRIPT: HTMLScriptElement[] = [];
	private _css: string[] = [];
	private _cssLib: string[] = [];
	private _js: string[] = [];
	private _jsLib: string[] = [];

	/**
	 * 取得：JavaScript
	 * @returns ソースファイル名
	 */
	public getJs(): string[] {
		return this._js;
	}

	/**
	 * 取得：JavaScript for lib
	 * @returns ソースファイル名
	 */
	public getJsLib(): string[] {
		return this._jsLib;
	}

	/**
	 * 取得：JavaScript
	 * @returns ソースファイル名
	 */
	public getCss(): string[] {
		return this._css;
	}

	/**
	 * 取得：JavaScript for lib
	 * @returns ソースファイル名
	 */
	public getCssLib(): string[] {
		return this._cssLib;
	}

	/**
	 * CSS
	 * @param src ソースパス
	 */
	public css(src: string): void {
		this._css.push(src);
		this.documentCss(src);
	}

	/**
	 * CSS for lib
	 * @param src ソースパス
	 */
	public cssLib(src: string): void {
		this._cssLib.push(src);
		this.documentCss(src);
	}

	/**
	 * document - CSS
	 * @param src ソースパス
	 */
	public documentCss(src: string): void {
		if (typeof document !== "undefined" && document) {
			const head: HTMLElement = document.getElementsByTagName("head")[0];
			const link: HTMLLinkElement = document.createElement("link");

			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = src;
			head.appendChild(link);
		}
	}

	/**
	 * JavaScript
	 * @param src ソースパス
	 */
	public js(src: string): void {
		this._js.push(src);
		this.documentJs(src);
	}

	/**
	 * JavaScript for lib
	 * @param src ソースパス
	 */
	public jsLib(src: string): void {
		this._jsLib.push(src);
		this.documentJs(src);
	}

	/**
	 * document - JavaScript
	 * @param src ソースパス
	 */
	private documentJs(src: string): void {
		if (typeof document !== "undefined" && document) {
			const script: HTMLScriptElement = document.createElement("script");
			script.defer = true;
			script.src = src;
			script.onload = () => {
				if (this.SCRIPT.length > 0) {
					this.SCRIPT.shift();
				}

				if (this.SCRIPT.length > 0) {
					this.documentJsAdd(this.SCRIPT[0]);
				}
			};

			this.SCRIPT.push(script);
			if (this.SCRIPT.length === 1) {
				this.documentJsAdd(this.SCRIPT[0]);
			}
		}
	}

	/**
	 * document - JavaScript - 追加
	 * @param script Script(JavaScript)オブジェクト
	 */
	private documentJsAdd(script: HTMLScriptElement): void {
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	/**
	 * include
	 */
	public include(): void {
		this.includeCss();
		this.includeJs();
	}

	/**
	 * include CSS
	 */
	public includeCss(): void {
		this.cssLib("css/font-awesome.css");

		this.css("css/index.css");
	}

	/**
	 * include JavaScript
	 */
	public includeJs(): void {
		this.js("js/index.js");
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface module {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.app = app;
} else {
	(function () {
		let fDev = false;

		// 引数処理
		const params: string[] = location.search.substring(1).split("&");
		for (let i = 0; i < params.length; i++) {
			const v: string = params[i];
			const n: number = v.search(/=/);
			const key: string = n !== -1 ? v.slice(0, n).toLocaleLowerCase() : "";
			const val: string = decodeURI(v.slice(v.indexOf("=", 0) + 1));
			if (key) {
				// 開発モード：minify あり / なし
				if (key === "dev" && val === "1") {
					fDev = true;
				}
			}
		}

		if (fDev) {
			const oApp: app = new app();
			oApp.include();

			console.log("\u001b[31m開発モード\u001b[30m");
		} else {
			const oApp: app = new app();
			oApp.js("js/index.min.js");
			oApp.css("css/index.min.css");
		}
	})();
}
