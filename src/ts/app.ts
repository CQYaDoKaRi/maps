/**
 * アプリケーション
 */
class app {
	private SCRIPT: HTMLScriptElement[] = [];

    /**
     * CSS読み込み
     * @param src ソースパス
     */
	public css(src: string): void{
		const head: HTMLElement = document.getElementsByTagName("head")[0];
		const link: HTMLLinkElement = document.createElement("link");

		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = src;
		head.appendChild(link);
	}

    /**
     * JavaScript読み込み
     * @param src ソースパス
     */
	public js(src: string): void {
		const script: HTMLScriptElement = document.createElement("script");
		script.defer = true;
		script.src = src;
		script.onload = () => {
			if (this.SCRIPT.length > 0) {
				this.SCRIPT.shift();
			}

			if (this.SCRIPT.length > 0) {
				this.jsAdd(this.SCRIPT[0]);
			}
		};

		this.SCRIPT.push(script);
		if (this.SCRIPT.length === 1) {
			this.jsAdd(this.SCRIPT[0]);
		}
	}

    /**
     * JavaScript追加
     * @param script Script(JavaScript)オブジェクト
     */
	private jsAdd(script: HTMLScriptElement): void {
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}