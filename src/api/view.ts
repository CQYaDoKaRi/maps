import path from "path";
import fs, { Dirent } from "fs";

export type apiViewGpxFilesData = {
	name: string;
	size: number;
	date: string;
};

/**
 * GPX ファイルリストを取得
 * @param dir data フォルダー
 * @returns JSON
 */
export const apiViewGpxFiles = (dir: string): apiViewGpxFilesData[] => {
	const dateFormat = (dt: Date): string => {
		const FileStatDateYY = `${dt.getFullYear()}`;
		const FileStatDateMM = `00${dt.getMonth() + 1}`.slice(-2);
		const FileStatDateDD = `00${dt.getDate()}`.slice(-2);
		const FileStatDateTHH = `00${dt.getHours()}`.slice(-2);
		const FileStatDateTMM = `00${dt.getMinutes()}`.slice(-2);
		const FileStatDateTDD = `00${dt.getSeconds()}`.slice(-2);
		return `${FileStatDateYY}/${FileStatDateMM}/${FileStatDateDD} ${FileStatDateTHH}:${FileStatDateTMM}:${FileStatDateTDD}`;
	};

	const data: apiViewGpxFilesData[] = [];
	const gpx = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((dirent) => dirent.isFile() && path.extname(dirent.name).toLowerCase() === ".gpx");

	gpx.forEach((file: Dirent) => {
		const fileStat = fs.statSync(`${dir}/${file.name}`);
		const dataItem: apiViewGpxFilesData = {
			name: file.name,
			size: fileStat.size,
			date: dateFormat(fileStat.mtime),
		};
		data.push(dataItem);
	});

	return data;
};
