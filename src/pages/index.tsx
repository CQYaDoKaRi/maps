import { GetServerSideProps } from "next";
import Link from "next/link";

import { Provider } from "react-redux";

import store, { storeDispatchMenu, storeGetMenuKey } from "../view/RStore";

import View from "../view/View";
import { ViewMenuTitle } from "../view/ViewMenu";

type propsType = {
	gpx: propsGpxFiles[];
};

type propsGpxFiles = {
	name: string;
	size: number;
	date: string;
};

const evt = () => {
	if (typeof window !== "undefined") {
		const hash = `#${storeGetMenuKey()}`;
		window.location.hash = hash;
	}
};

/**
 * ページ
 * @param param0
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const index = ({ gpx }: propsType) => {
	const api = "http://localhost:8080/";
	const titleData: ViewMenuTitle[] = [
		{ key: "Distance", title: "２地点間の距離と角度を求め、その地点からの距離と角度から緯度経度を求める" },
		{ key: "Scale", title: "ズームレベルから縮尺を求める" },
		{
			key: "Tile",
			title:
				"緯度経度から地図タイルを取得し、タイル左上原点の「緯度、経度」と標高タイル（TXT、PNG）から「標高」を求める",
		},
		{
			key: "DataGpx",
			title:
				"GPS ログデータ（GPX）を読み込み、「時間、経度、緯度、標高」に加え「距離、角度、勾配、速度」を算出して表示",
		},
		{ key: "MongoDB", title: "MongoDB（地理空間データ）によるデータ検索" },
	];

	const getHash = () => {
		let vHash = "";
		let f = false;
		if (typeof window !== "undefined") {
			vHash = window.location.hash;
			if (vHash.length > 0) {
				vHash = vHash.substring(1);
			}

			titleData.map((item: ViewMenuTitle) => {
				if (item.key.toLowerCase() === vHash.toLowerCase()) {
					f = true;
				}
			});
		}

		if (!f) {
			vHash = titleData[0].key;
		}

		return vHash;
	};

	store.subscribe(() => {
		evt();
	});

	storeDispatchMenu(getHash());

	return (
		<>
			<Provider store={store}>
				<View api={api} titleData={titleData} />
			</Provider>
			<div>GPXデータ</div>
			<ul>
				{gpx.map((item: propsGpxFiles) => {
					return (
						<li key={item.name}>
							<Link href={`/items/${item.name}?size=${item.size}&date=${item.date}`}>
								<a>{item.name}</a>
							</Link>
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default index;

/**
 * データ取得
 * @returns gpx データ
 */
export const getServerSideProps: GetServerSideProps = async () => {
	const res = await fetch(`http://localhost:8080/api/view/gpx/files`);
	const gpx: propsGpxFiles[] = (await res.json()) as propsGpxFiles[];

	// サーバー側へ出力されるログ
	console.log(gpx);

	return { props: { gpx } };
};
