// npm install --save-dev react @types/react
import React, { useState, useRef, useEffect } from "react";
// npm install --save-dev react-bootstrap bootstrap
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

import { maps, mapsLatLon, mapsTile, mapsTileDem } from "../ts/maps";
import { appMapsGSI } from "../ts/appMapsGSI";

/**
 * React Component - ViewMapsTitle - props
 */
type Props = {
	lat: number;
	lon: number;
	dpi: number;
};

/**
 * React Component - ViewMapsTitle
 * @param props props
 */
const ViewMapsTitle: React.FC<Props> = (props) => {
	const oMaps: maps = new maps();

	// state
	const [zView, setZView] = useState(4);
	const [lat, setLat] = useState(props.lat);
	const [lon, setLon] = useState(props.lon);
	const [tile, setTile] = useState<mapsTile>(oMaps.tile(lat, lon, zView));
	const [tileUrl, setTileUrl] = useState(`https://cyberjapandata.gsi.go.jp/xyz/std/${tile.z}/${tile.x}/${tile.y}.png`);
	const [tileLatLon, setTileLatLon] = useState<mapsLatLon>(oMaps.tile2LatLon(tile.x, tile.y, tile.z));
	const [dpi] = useState(props.dpi);

	// オブジェクト
	const oTile = useRef(null);
	const oTileSymbol = useRef(null);
	const oDemTxt = useRef(null);
	const oDemPng = useRef(null);

	/**
	 * イベント：緯度
	 * @param e 緯度
	 */
	const onChange = (e: React.ChangeEvent) => {
		const target = e.target as HTMLInputElement;
		if (target.id === "lat") {
			setLat(+target.value);
		}
		if (target.id === "lon") {
			setLon(+target.value);
		}
	};

	/**
	 * イベント：ズームレベル
	 * @param z ズームレベル
	 */
	const onChangeZ = (z: number) => {
		const oMaps: maps = new maps();

		const vTile: mapsTile = oMaps.tile(lat, lon, z);
		setTileUrl(`https://cyberjapandata.gsi.go.jp/xyz/std/${vTile.z}/${vTile.x}/${vTile.y}.png`);
		setTileLatLon(oMaps.tile2LatLon(vTile.x, vTile.y, vTile.z));

		setZView(z);
		setTile(vTile);
	};

	/**
	 * タイル：シンボル：初期処理
	 * @returns シンボルオブジェクト
	 */
	const initSymbolInit = () => {
		const oTileImgSymbol = (oTileSymbol.current as unknown) as HTMLElement;
		oTileImgSymbol.innerHTML = "";
		return oTileImgSymbol;
	};

	/**
	 * タイル：シンボル：設定
	 */
	const setSymbolSet = () => {
		const oTileImg = (oTile.current as unknown) as HTMLImageElement;
		const oTileImgSymbol = initSymbolInit();

		if (oTileImg.getAttribute("data-init") === "true") {
			const oappMapsGSI = new appMapsGSI(oMaps);
			oappMapsGSI.setDiv(oTileImgSymbol);
			oappMapsGSI.setTile(oTileImg, tile);
			oappMapsGSI.Symbol(24, 24);
		}
	};

	useEffect(() => {
		onChangeZ(zView);
		setSymbolSet();

		const oTdDemTxt = (oDemTxt.current as unknown) as HTMLElement;
		const oTdDemPng = (oDemPng.current as unknown) as HTMLElement;

		const oMapTileDem: Promise<mapsTileDem> | null = oMaps.tileDemTxt(tile);
		if (oMapTileDem) {
			void oMapTileDem.then((data: mapsTileDem) => {
				if (!data.tile) {
					return;
				}

				if (isNaN(data.e)) {
					oTdDemTxt.innerHTML = "標高データなし";
				} else {
					oTdDemTxt.innerHTML = `${data.e.toLocaleString()} m<br /><a href="${data.url}" target="_brank">${
						data.url
					}</a>`;
				}
			});
		}

		const oMapTileDemPng: Promise<mapsTileDem> | null = oMaps.tileDemPng(tile);
		if (oMapTileDemPng) {
			void oMapTileDemPng.then((data: mapsTileDem) => {
				if (!data.tile) {
					return;
				}

				if (isNaN(data.e)) {
					oTdDemPng.innerHTML = "標高データなし";
				} else {
					oTdDemPng.innerHTML = `${data.e.toLocaleString()} m<br /><a href="${data.url}" target="_brank">${
						data.url
					}</a>`;
				}
			});
		}
	}, [lat, lon, zView]);

	useEffect(() => {
		const oTileImg = (oTile.current as unknown) as HTMLImageElement;
		oTileImg.onload = () => {
			oTileImg.setAttribute("data-init", "true");
			setSymbolSet();
		};
		oTileImg.onerror = () => {
			oTileImg.onload = () => {
				return;
			};
			initSymbolInit();
			oTileImg.setAttribute("data-init", "false");
			oTileImg.src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGU2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgMTE2LjE2NDY1NSwgMjAyMS8wMS8yNi0xNTo0MToyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wMy0xN1QwMDowNTo1NCswOTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMy0xN1QwMDowNTo1NCswOTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDMtMTdUMDA6MDU6NTQrMDk6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZTA3YTBlMjctNGM3Zi1lZDRhLTlkMWYtNzhiYWNkNDFkZTYwIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQyY2UwZGYtYjk2Mi1kOTRjLTgwM2UtYmQ0NGVkZjEzZTRlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWRkZWU1OWEtNzhiYS1kNTQ4LThmZDAtZThhNjE2OTg1OTc0IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWRkZWU1OWEtNzhiYS1kNTQ4LThmZDAtZThhNjE2OTg1OTc0IiBzdEV2dDp3aGVuPSIyMDIxLTAzLTE3VDAwOjA1OjU0KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUwN2EwZTI3LTRjN2YtZWQ0YS05ZDFmLTc4YmFjZDQxZGU2MCIgc3RFdnQ6d2hlbj0iMjAyMS0wMy0xN1QwMDowNTo1NCswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ik5vIFRpbGUiIHBob3Rvc2hvcDpMYXllclRleHQ9Ik5vIFRpbGUiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiuXnEoAAAf1SURBVHja7d3LedQ8GIDR9EIdVEEPaWE6SAdUQAMUQAEUkD377FkP3//MT55gybYkjy/ynLMMhBDLry8aX56u8MCeLAIEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAA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";
		};
	}, [tileUrl]);

	const scale = [];
	for (let n = 4; n < 19; n++) {
		scale.push(n);
	}

	return (
		<div className="contentsTile">
			<InputGroup className="mb-3" style={{ width: "400px", paddingLeft: "5px" }}>
				<InputGroup.Prepend>
					<InputGroup.Text id="lat">緯度</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					type="number"
					style={{ width: "200px" }}
					id="lat"
					defaultValue={lat}
					placeholder="緯度"
					onChange={onChange}
				/>
			</InputGroup>
			<InputGroup className="mb-3" style={{ width: "400px", paddingLeft: "5px" }}>
				<InputGroup.Prepend>
					<InputGroup.Text id="lat">経度</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					type="number"
					style={{ width: "200px" }}
					id="lon"
					defaultValue={lon}
					placeholder="経度"
					onChange={onChange}
				/>
			</InputGroup>
			<hr />
			<InputGroup className="mb-3" style={{ width: "400px", paddingLeft: "5px" }}>
				<InputGroup.Prepend>
					<InputGroup.Text id="lat">ズームレベル</InputGroup.Text>
				</InputGroup.Prepend>
				<DropdownButton title={zView}>
					{scale.map((z: number) => {
						return (
							<Dropdown.Item
								key={z}
								onSelect={() => {
									onChangeZ(z);
								}}
							>
								{z}
							</Dropdown.Item>
						);
					})}
				</DropdownButton>
			</InputGroup>
			<hr />
			<Table striped bordered hover size="sm" style={{ width: "1100px" }}>
				<tbody>
					<tr>
						<th rowSpan={6} style={{ width: "270px", verticalAlign: "middle" }}>
							<img ref={oTile} src={tileUrl} />
							<div ref={oTileSymbol}></div>
						</th>
						<th style={{ width: "250px" }}>縮尺</th>
						<td>{`1 / ${Math.floor(oMaps.tileScale(zView, lat, dpi)).toLocaleString()}`}</td>
					</tr>
					<tr>
						<th style={{ width: "250px" }}>
							タイル座標X
							<br />
							タイル座標Y
						</th>
						<td>
							{tile.x}
							<br />
							{tile.y}
						</td>
					</tr>
					<tr>
						<th style={{ width: "150px" }}>
							タイル左上からX方向のpixel値
							<br />
							タイル左上からY方向のpixel値
						</th>
						<td>
							{tile.px_x} px
							<br />
							{tile.px_y} px
						</td>
					</tr>
					<tr>
						<th style={{ width: "150px" }}>
							タイル左上の緯度
							<br />
							タイル左上の緯経度
						</th>
						<td>
							{tileLatLon.lat}
							<br />
							{tileLatLon.lon}
						</td>
					</tr>
					<tr>
						<th style={{ width: "150px" }}>
							標高（TXT形式）
							<br />
							標高タイル
						</th>
						<td ref={oDemTxt}></td>
					</tr>
					<tr>
						<th style={{ width: "150px" }}>
							標高（PNG形式）
							<br />
							標高タイル
						</th>
						<td ref={oDemPng}></td>
					</tr>
				</tbody>
			</Table>
		</div>
	);
};

export default ViewMapsTitle;
