/// <reference types="cypress" />

// 設定：URL
const url = "http://localhost:8080";

// 設定：パラメーター
const params = [
	{ key: "Distance", title: "２地点間の距離を求める" }
	, { key: "DistanceTo", title: "ある地点から角度と距離を指定して地点を求める" }
	, { key: "Scale", title: "ズームレベルと縮尺" }
	, { key: "Tile", title: "緯度経度からタイル情報を取得し、タイル左上原点の緯度経度を求める" }
	, { key: "TileE", title: "緯度経度からタイル情報を取得し、タイル左上原点の緯度経度と標高タイルから標高値を求める" }
	, { key: "DataGpx", title: "Garamin の GPS ログデータ（GPX）を読み込んでグラフ表示" }
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