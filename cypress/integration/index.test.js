/// <reference types="cypress" />

// 設定：URL
const url = "http://localhost:8080";

// 設定：パラメーター
const params = [
	{ key: "Distance", title: "２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める" }
	, { key: "Scale", title: "ズームレベルから縮尺を求める" }
	, { key: "Tile", title: "緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める" }
	, { key: "DataGpx", title: "GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示" }
];

function view(key) {
	params.map(
		(param) => {
			let param_key = param.key;
			if (param_key ===  "TileE" ){
				return;
			}
			if (key === "TileE") {
				key = "Tile";
			}
			let display = param_key === key ? "" : "not.";
			cy.get("#" + param_key).should(display + "be.visible");
		}
	);
}

describe("maps", () => {
	beforeEach(() => {
		cy.visit(url);
	})

	it ("menu", () => {
		cy.get("#menu").children("ul").children().each(($li, index, $list) => {
			cy.get($li).should("have.text", params[index].title);
		});
	})

	it ("menu-click", () => {
		cy.get("#menu").children("ul").children().each(($li, index, $list) => {
			cy.get($li).click();
		});
	})
})

params.map(
	(param) => {
		describe("maps-" + param.key, () => {
			beforeEach(() => {
				cy.visit(url + "/index.html#" + param.key);
			})

			it ("view", () => {
				view(param.key);
			})
		})
	}
);