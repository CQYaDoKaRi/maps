const maps = require("./maps");

exports.handler = async (event) => {
	const oMaps = new maps.maps();
	const res = {};
	res.statusCode = 400;

	if (!event.api) {
		return res;
	}

	res.api = event.api;
	// 方位角を12方位名に変換
	if (event.api === "deg2name") {
		const deg = event.deg;
		if (!Number.isNaN(deg)) {
			res.statusCode = 200;
			res.name = oMaps.deg2Name(deg);
		}
		return res;
	}
	// 日本測地系を世界測地系に変換（1次式）
	else if (event.api === "tky2jgdg") {
		const lat = +event.lat;
		const lon = +event.lon;
		if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
			res.statusCode = 200;
			const ret = oMaps.tky2jgdG(lat, lon);
			res.lat = ret.lat;
			res.lon = ret.lon;
		}
		return res;
	}
	// 世界測地系を日本測地系に変換（1次式）
	else if (event.api === "jgd2tkyg") {
		const lat = +event.lat;
		const lon = +event.lon;
		if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
			res.statusCode = 200;
			const ret = oMaps.jgd2tkyG(lat, lon);
			res.lat = ret.lat;
			res.lon = ret.lon;
		}
		return res;
	}
	// ２地点間の距離（球面三角法）
	else if (event.api === "distancet") {
		const lat1 = +event.lat1;
		const lon1 = +event.lon1;
		const lat2 = +event.lat2;
		const lon2 = +event.lon2;
		if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
			res.statusCode = 200;
			res.distance = oMaps.distanceT(lat1, lon1, lat2, lon2);
		}
		return res;
	}
	// ２地点間の距離（ヒュベニ）
	else if (event.api === "distanceh") {
		const lat1 = +event.lat1;
		const lon1 = +event.lon1;
		const lat2 = +event.lat2;
		const lon2 = +event.lon2;
		if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
			res.statusCode = 200;
			res.distance = oMaps.distanceH(lat1, lon1, lat2, lon2);
		}
		return res;
	}
	// ２地点間の距離（測地線航海算法）
	else if (event.api === "distances") {
		const lat1 = +event.lat1;
		const lon1 = +event.lon1;
		const lat2 = +event.lat2;
		const lon2 = +event.lon2;
		if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
			res.statusCode = 200;
			res.distance = oMaps.distanceS(lat1, lon1, lat2, lon2);
		}
		return res;
	}
	// 角度・距離から緯度経度を取得
	else if (event.api === "distanceto") {
		const lat = +event.lat;
		const lon = +event.lon;
		const a = +event.a;
		const len = +event.len;
		if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(a) && !Number.isNaN(len)) {
			res.statusCode = 200;
			const ret = oMaps.distanceTo(lat, lon, a, len);
			res.lat = ret.lat;
			res.lon = ret.lon;
		}
		return res;
	}
	// ２地点間の角度
	else if (event.api === "direction") {
		const lat1 = +event.lat1;
		const lon1 = +event.lon1;
		const lat2 = +event.lat2;
		const lon2 = +event.lon2;
		if (!Number.isNaN(lat1) && !Number.isNaN(lon1) && !Number.isNaN(lat2) && !Number.isNaN(lon2)) {
			res.statusCode = 200;
			res.a = oMaps.direction(lat1, lon1, lat2, lon2);
		}
		return res;
	}

	// タイル座標を取得
	else if (event.api === "tile") {
		const lat = +event.lat;
		const lon = +event.lon;
		const z = +event.z;
		if (!Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(z)) {
			res.statusCode = 200;
			const tile = oMaps.tile(lat, lon, z);
			res.x = tile.x;
			res.y = tile.y;
			res.z = tile.z;
			res.px_x = tile.px_x;
			res.px_y = tile.px_y;
		}
		return res;
	}
	// タイル座標から緯度経度を取得
	else if (event.api === "tile2latlon") {
		const x = +event.x;
		const y = +event.y;
		const z = +event.z;
		if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
			res.statusCode = 200;
			const pos = oMaps.tile2LatLon(x, y, z);
			res.lat = pos.lat;
			res.lon = pos.lon;
		}
		return res;
	}
	// タイル座標のズームレベルから縮尺を取得
	else if (event.api === "tilescale") {
		const lat = +event.lat;
		const z = +event.z;
		const dpi = +event.dpi;
		if (!Number.isNaN(lat) && !Number.isNaN(z) && !Number.isNaN(dpi)) {
			res.statusCode = 200;
			res.scale = oMaps.tileScale(z, lat, dpi);
		}
		return res;
	}
	// タイル座標のズームレベルを変更した場合のタイル座標を取得
	else if (event.api === "tile2z") {
		const x = +event.x;
		const y = +event.y;
		const z = +event.z;
		const toz = +event.toz;
		if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z) && !Number.isNaN(toz)) {
			res.statusCode = 200;
			const tile = oMaps.tile2z(x, y, z, toz);
			res.x = tile.x;
			res.t = tile.y;
			res.z = tile.z;
		}
		return res;
	}
	// 標高タイルURLを取得
	else if (event.api === "tiledemurl" || event.api === "tiledemurlpng" || event.api === "tiledemurltxt") {
		let type = event.type;
		const x = +event.x;
		const y = +event.y;
		const z = +event.z;
		if (event.api === "tiledemurlpng") {
			type = "png";
		} else if (event.api === "tiledemurltxt") {
			type = "txt";
		}
		if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
			res.statusCode = 200;
			res.urls = [];

			let tileUrls = [];
			if (type === "png") {
				tileUrls = oMaps.tileDemUrlPng(x, y, z);
			} else {
				tileUrls = oMaps.tileDemUrlTxt(x, y, z);
			}

			tileUrls.map((tileUrl) => {
				if (tileUrl.tile) {
					res.urls.push({
						x: tileUrl.tile.x,
						y: tileUrl.tile.y,
						z: tileUrl.tile.z,
						ext: tileUrl.ext,
						url: tileUrl.url,
					});
				}
			});
		}
		return res;
	}

	//
	else {
		return res;
	}
};
