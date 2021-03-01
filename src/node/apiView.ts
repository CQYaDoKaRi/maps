import express from "express";
import path from "path";
import fs, { Dirent } from "fs";

interface fileInfo {
	name: string;
	size: number;
	date: string;
}

export class apiView {
	private uri = "";

	/**
	 * コンストラクター
	 * @param uri API URI
	 */
	constructor(uri: string) {
		this.uri = `${uri}/view`;
	}

	/**
	 * 登録
	 * @param router express - Router
	 */
	public regist(router: express.Router): void {
		router.get(this.uri + "/gpx/files", (req: express.Request, res: express.Response) => {
			const data: fileInfo[] = [];
			const dateFormat = (dt: Date): string => {
				const FileStatDateYY = `${dt.getFullYear()}`;
				const FileStatDateMM = `00${dt.getMonth() + 1}`.slice(-2);
				const FileStatDateDD = `00${dt.getDate()}`.slice(-2);
				const FileStatDateTHH = `00${dt.getHours()}`.slice(-2);
				const FileStatDateTMM = `00${dt.getMinutes()}`.slice(-2);
				const FileStatDateTDD = `00${dt.getSeconds()}`.slice(-2);
				return `${FileStatDateYY}/${FileStatDateMM}/${FileStatDateDD} ${FileStatDateTHH}:${FileStatDateTMM}:${FileStatDateTDD}}`;
			};

			const dir = path.join(__dirname, "./../../public/data");
			const gpx = fs
				.readdirSync(dir, { withFileTypes: true })
				.filter((dirent) => dirent.isFile() && path.extname(dirent.name).toLowerCase() === ".gpx");

			gpx.forEach((file: Dirent) => {
				const fileStat = fs.statSync(`${dir}/${file.name}`);
				const dataItem: fileInfo = {
					name: file.name,
					size: fileStat.size,
					date: dateFormat(fileStat.mtime),
				};
				data.push(dataItem);
			});

			res.json(data);
			res.end();
		});
	}
}
