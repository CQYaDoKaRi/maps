import log4js from "log4js";

export class log {
	private logger: log4js.Logger;

	/**
	 * コンストラクター
	 * @dir ログフォルダー
	 * @param name ログファイル名
	 */
	constructor(dir: string) {
		log4js.configure({
			appenders: {
				console: {
					type: "console",
					level: "all",
					layout: {
						type: "pattern",
						pattern: "[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %m",
					},
				},
				system: {
					type: "file",
					filename: `${dir}/maps.log`,
					layout: {
						type: "pattern",
						pattern: "[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %m",
					},
					// 5MB
					maxLogSize: 5242880,
					// 世代管理(古いファイルは gz で圧縮)
					backups: 10,
					compress: true,
				},
			},
			categories: {
				default: {
					appenders: ["console", "system"],
					level: "all",
				},
			},
		});

		this.logger = log4js.getLogger();
	}

	/**
	 * ログ：info
	 * @param msg メッセージ
	 */
	public info(msg: string): void {
		this.logger.info(msg);
	}

	/**
	 * ログ：error
	 * @param msg エラー
	 */
	public error(msg: string): void {
		this.logger.error(msg);
	}
}
