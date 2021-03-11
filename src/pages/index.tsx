import Link from "next/link";

import { ViewMenuTitle } from "../view/ViewMenu";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const index = () => {
	const title: ViewMenuTitle[] = [
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

	return (
		<>
			<div>トップページ</div>
			<ul>
				{title.map((item: ViewMenuTitle) => {
					return (
						<li>
							<Link href={`/items/${item.key}?title=${item.title}`}>
								<a>{item.title}</a>
							</Link>
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default index;
