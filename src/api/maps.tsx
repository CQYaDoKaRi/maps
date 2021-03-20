import { maps } from "../ts/maps";

/**
 * deg2Name
 */
export type mapsApiDeg2NameResult = {
	status: boolean;
	name: string;
};

/**
 * 方位角を12方位名に変換
 * @param deg 方位の角度
 * @returns mapsApiDeg2NameResult
 */
export const mapsApiDeg2Name = (deg: number | undefined): mapsApiDeg2NameResult => {
	const ret: mapsApiDeg2NameResult = {
		status: false,
		name: "",
	};

	const oMaps: maps = new maps();

	if (deg) {
		deg = +deg;
		if (!Number.isNaN(deg)) {
			ret.status = true;
			ret.name = oMaps.deg2Name(deg);
		}
	}

	return ret;
};
