/**
 * 地図：データ：都道府県庁：項目
 */
export class mapsDataPrefCapitalItem {
	public pref = "";
	public addr = "";
	public lat = 0.0;
	public lon = 0.0;
	public distT = 0.0;
	public distH = 0.0;
	public distS = 0.0;
	public a = 0.0;
	public c_lat = 0.0;
	public c_lon = 0.0;
}

/**
 * 地図：データ：都道府県庁
 */
export class mapsDataPrefCapital {
	private d: mapsDataPrefCapitalItem[] = [];

	/**
	 * コンストラクタ
	 */
	constructor() {
		this.set("北海道", "北海道札幌市中央区北3条西6丁目", 43.064301, 141.346874);
		this.set("青森県", "青森県青森市長島1-1-1", 40.824622, 140.740598);
		this.set("岩手県", "岩手県盛岡市内丸10-1", 39.7036, 141.152709);
		this.set("宮城県", "宮城県仙台市青葉区本町3-8-1", 38.268812, 140.872082);
		this.set("秋田県", "秋田県秋田市山王4-1-1", 39.718611, 140.102401);
		this.set("山形県", "山形県山形市松波2-8-1", 38.240422, 140.363592);
		this.set("福島県", "福島県福島市杉妻町2-16", 37.750301, 140.467522);
		this.set("茨城県", "茨城県水戸市笠原町978番6", 36.341793, 140.446802);
		this.set("栃木県", "栃木県宇都宮市塙田1-1-20", 36.566672, 139.883093);
		this.set("群馬県", "群馬県前橋市大手町1-1-1", 36.390698, 139.060451);
		this.set("埼玉県", "埼玉県さいたま市浦和区高砂3-15-1", 35.857431, 139.648901);
		this.set("千葉県", "千葉県千葉市中央区市場町1-1", 35.605045, 140.123325);
		this.set("東京都", "東京都新宿区西新宿2-8-1", 35.689753, 139.691731);
		this.set("神奈川県", "神奈川県横浜市中区日本大通1", 35.447495, 139.6424);
		this.set("新潟県", "新潟県新潟市中央区新光町4-1", 37.902419, 139.023225);
		this.set("富山県", "富山県富山市新総曲輪1-7", 36.695275, 137.211342);
		this.set("石川県", "石川県金沢市鞍月1-1", 36.59473, 136.625582);
		this.set("福井県", "福井県福井市大手3-17-1", 36.065219, 136.221682);
		this.set("山梨県", "山梨県甲府市丸の内1-6-1", 35.664161, 138.568459);
		this.set("長野県", "長野県長野市大字南長野字幅下692-2", 36.651296, 138.181239);
		this.set("岐阜県", "岐阜県岐阜市薮田南2-1-1", 35.391228, 136.722311);
		this.set("静岡県", "静岡県静岡市葵区追手町9-6", 34.976944, 138.383009);
		this.set("愛知県", "愛知県名古屋市中区三の丸三丁目1-2", 35.180344, 136.906632);
		this.set("三重県", "三重県津市広明町13", 34.730272, 136.508598);
		this.set("滋賀県", "滋賀県大津市京町四丁目1-1", 35.004528, 135.868607);
		this.set("京都府", "京都府京都市上京区下立売通新町西入薮ノ内町", 35.021393, 135.755439);
		this.set("大阪府", "大阪府大阪市中央区大手前2丁目", 34.686555, 135.519474);
		this.set("兵庫県", "兵庫県神戸市中央区下山手通5-10-1", 34.691287, 135.183061);
		this.set("奈良県", "奈良県奈良市登大路町30", 34.685326, 135.832751);
		this.set("和歌山県", "和歌山県和歌山市小松原通1-1", 34.226041, 135.167504);
		this.set("鳥取県", "鳥取県鳥取市東町1-220", 35.503867, 134.237716);
		this.set("島根県", "島根県松江市殿町1番地", 35.472324, 133.05052);
		this.set("岡山県", "岡山県岡山市内山下2-4-6", 34.661759, 133.934399);
		this.set("広島県", "広島県広島市中区基町10-52", 34.396603, 132.459621);
		this.set("山口県", "山口県山口市滝町1-1", 34.18613, 131.470497);
		this.set("徳島県", "徳島県徳島市万代町1丁目1番地", 34.065756, 134.559297);
		this.set("香川県", "香川県高松市番町4-1-10", 34.340045, 134.043369);
		this.set("愛媛県", "愛媛県松山市一番町4-4-2", 33.841669, 132.765371);
		this.set("高知県", "高知県高知市丸ノ内1丁目2-20", 33.5597, 133.531096);
		this.set("福岡県", "福岡県福岡市博多区東公園7-7", 33.606781, 130.418307);
		this.set("佐賀県", "佐賀県佐賀市城内1-1-59", 33.24957, 130.299804);
		this.set("長崎県", "長崎県長崎市江戸町2-13", 32.744814, 129.8737);
		this.set("熊本県", "熊本県熊本市水前寺6-18-1", 32.789816, 130.74169);
		this.set("大分県", "大分県大分市大手町3-1-1", 33.238205, 131.612625);
		this.set("宮崎県", "宮崎県宮崎市橘通東2-10-1", 31.911058, 131.423883);
		this.set("鹿児島県", "鹿児島県鹿児島市鴨池新町10-1", 31.560166, 130.557994);
		this.set("沖縄県", "沖縄県那覇市泉崎1 - 2 - 2", 26.212418, 127.680895);
	}

	/**
	 * 設定
	 * @param pref 都道府県名
	 * @param addr 住所
	 * @param lat 緯度
	 * @param lon 経度
	 */
	private set(pref: string, addr: string, lat: number, lon: number): void {
		this.d.push({
			pref: pref,
			addr: addr,
			lat: lat,
			lon: lon,
			distT: 0.0,
			distH: 0.0,
			distS: 0.0,
			a: 0.0,
			c_lat: 0.0,
			c_lon: 0.0,
		});
	}

	/**
	 * 取得
	 * @returns データ
	 */
	public get(): mapsDataPrefCapitalItem[] {
		return this.d;
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface module {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exports: any;
}
if (typeof module !== "undefined" && module && module.exports) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.mapsDataPrefCapital = mapsDataPrefCapital;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	module.exports.mapsDataPrefCapitalItem = mapsDataPrefCapitalItem;
}
