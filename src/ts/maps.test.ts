import { maps } from "./maps";

test("方位角を方位名(略字)に変換", (): void => {
	const oMaps: maps = new maps();

	// 正常範囲
	expect(oMaps.deg2Name(0)).toBe("N");
	expect(oMaps.deg2Name(11.25)).toBe("NNE");
	expect(oMaps.deg2Name(33.75)).toBe("NE");
	expect(oMaps.deg2Name(56.25)).toBe("ENE");
	expect(oMaps.deg2Name(78.75)).toBe("E");
	expect(oMaps.deg2Name(101.25)).toBe("ESE");
	expect(oMaps.deg2Name(123.75)).toBe("SE");
	expect(oMaps.deg2Name(146.25)).toBe("SSE");
	expect(oMaps.deg2Name(168.75)).toBe("S");
	expect(oMaps.deg2Name(191.25)).toBe("SSW");
	expect(oMaps.deg2Name(213.75)).toBe("SW");
	expect(oMaps.deg2Name(236.25)).toBe("WSW");
	expect(oMaps.deg2Name(258.75)).toBe("W");
	expect(oMaps.deg2Name(281.25)).toBe("WNW");
	expect(oMaps.deg2Name(303.75)).toBe("NW");
	expect(oMaps.deg2Name(326.25)).toBe("NNW");
	// 0 度以下
	expect(oMaps.deg2Name(-360)).toBe("N");
	expect(oMaps.deg2Name(-348.75)).toBe("NNE");
	expect(oMaps.deg2Name(-326.25)).toBe("NE");
	expect(oMaps.deg2Name(-303.75)).toBe("ENE");
	expect(oMaps.deg2Name(-281.25)).toBe("E");
	expect(oMaps.deg2Name(-258.75)).toBe("ESE");
	expect(oMaps.deg2Name(-236.25)).toBe("SE");
	expect(oMaps.deg2Name(-213.75)).toBe("SSE");
	expect(oMaps.deg2Name(-191.25)).toBe("S");
	expect(oMaps.deg2Name(-168.75)).toBe("SSW");
	expect(oMaps.deg2Name(-146.25)).toBe("SW");
	expect(oMaps.deg2Name(-123.75)).toBe("WSW");
	expect(oMaps.deg2Name(-101.25)).toBe("W");
	expect(oMaps.deg2Name(-78.75)).toBe("WNW");
	expect(oMaps.deg2Name(-56.25)).toBe("NW");
	expect(oMaps.deg2Name(-33.75)).toBe("NNW");
	// 360度以上
	expect(oMaps.deg2Name(360)).toBe("N");
	expect(oMaps.deg2Name(371.25)).toBe("NNE");
	expect(oMaps.deg2Name(393.75)).toBe("NE");
	expect(oMaps.deg2Name(416.25)).toBe("ENE");
	expect(oMaps.deg2Name(438.75)).toBe("E");
	expect(oMaps.deg2Name(461.25)).toBe("ESE");
	expect(oMaps.deg2Name(483.75)).toBe("SE");
	expect(oMaps.deg2Name(506.25)).toBe("SSE");
	expect(oMaps.deg2Name(528.75)).toBe("S");
	expect(oMaps.deg2Name(551.25)).toBe("SSW");
	expect(oMaps.deg2Name(573.75)).toBe("SW");
	expect(oMaps.deg2Name(596.25)).toBe("WSW");
	expect(oMaps.deg2Name(618.75)).toBe("W");
	expect(oMaps.deg2Name(641.25)).toBe("WNW");
	expect(oMaps.deg2Name(663.75)).toBe("NW");
	expect(oMaps.deg2Name(686.25)).toBe("NNW");
});

test("２地点間の距離-球面三角法", (): void => {
	const oMaps: maps = new maps();

	const lat1 = 35.689753;
	const lon1 = 139.691731;
	const lat2 = 35.447495;
	const lon2 = 139.6424;
	expect(oMaps.distanceT(lat1, lon1, lat2, lon2)).toBe(27335.473262593438);
});

test("２地点間の距離-ヒュベニ", (): void => {
	const oMaps: maps = new maps();

	const lat1 = 35.689753;
	const lon1 = 139.691731;
	const lat2 = 35.447495;
	const lon2 = 139.6424;
	expect(oMaps.distanceH(lat1, lon1, lat2, lon2)).toBe(27248.24567995688);
});

test("２地点間の距離-測地線航海算法", (): void => {
	const oMaps: maps = new maps();

	const lat1 = 35.689753;
	const lon1 = 139.691731;
	const lat2 = 35.447495;
	const lon2 = 139.6424;
	expect(oMaps.distanceS(lat1, lon1, lat2, lon2)).toBe(32204.322252668517);
});
