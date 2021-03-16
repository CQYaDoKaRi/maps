import { indexView } from "./indexView";
import { ViewMenuTitle } from "./ViewMenu";
import dTitle from "../json/dTitle.json";

/**
 * ページ
 * @param oView indexView
 */
const page = (oView: indexView) => {
	oView.display(getHash());
};

/**
 * URL ハッシュ値の取得
 * @returns ハッシュ値
 */
const getHash = () => {
	let vHash: string = window.location.hash;
	if (vHash.length > 0) {
		vHash = vHash.substring(1);
	}

	let f = false;
	dTitle.map((item: ViewMenuTitle) => {
		if (item.key.toLowerCase() === vHash.toLowerCase()) {
			f = true;
		}
	});

	if (!f) {
		vHash = dTitle[0].key;
	}

	return vHash;
};

/**
 * window.onload
 */
window.onload = () => {
	const oView: indexView = new indexView();
	dTitle.map((item: ViewMenuTitle) => {
		oView.setMenuTitle(item);
	});

	const oContents = document.getElementById("app");
	if (oContents) {
		oView.renderApp(oContents, getHash());
	}

	page(oView);

	/**
	 * window.onhashchange
	 */
	window.onhashchange = () => {
		page(oView);
	};
};
