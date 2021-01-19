using System;

namespace Maps
{
	public class Tile
	{
		/// <summary>
		/// 経度からタイル座標Yを取得
		/// </summary>
		/// <param name="lon">経度</param>
		/// <param name="z">ズームレベル</param>
		/// <param name="n">タイル番号</param>
		/// <param name="px">タイル内の座標[px]</param>
		public void GetTileX(double lon, int z, out int n, out int px) {
			double lng_rad = lon * Math.PI / 180;
			double R = 128 / Math.PI;
			double worldCoordX = R * (lng_rad + Math.PI);
			double pixelCoordX = worldCoordX * Math.Pow(2, z);
			double tileCoordX = Math.Floor(pixelCoordX / 256);
			n = (int) (tileCoordX);
			px = (int) (Math.Floor(pixelCoordX - tileCoordX * 256));
		}

		/// <summary>
		/// 緯度からタイル座標Xを取得
		/// </summary>
		/// <param name="lat">緯度</param>
		/// <param name="z">ズームレベル</param>
		/// <param name="n">タイル番号</param>
		/// <param name="px">タイル内の座標[px]</param>
		public void GetTileY(double lat, int z, out int n, out int px) {
			double lat_rad = lat * Math.PI / 180;
			double R = 128 / Math.PI;
			double worldCoordY = -R / 2 * Math.Log((1 + Math.Sin(lat_rad)) / (1 - Math.Sin(lat_rad))) + 128;
			double pixelCoordY = worldCoordY * Math.Pow(2, z);
			double tileCoordY = Math.Floor(pixelCoordY / 256);
			n = (int) (tileCoordY);
			px = (int) (Math.Floor(pixelCoordY - tileCoordY * 256));
		}

		/// <summary>
		/// タイル座標から経度を取得
		/// </summary>
		/// <param name="x">タイル座標X</param>
		/// <param name="z">ズームレベル</param>
		/// <returns>経度</returns>
		public double GetTileLon(double x, int z) {
			return (x / Math.Pow(2, z) * 360 - 180);
		}

		/// <summary>
		/// タイル座標から緯度を取得
		/// </summary>
		/// <param name="y">タイル座標Y</param>
		/// <param name="z">ズームレベル</param>
		/// <returns>経度</returns>
		public double GetTileLat(double y, int z) {
			double n = Math.PI - 2 * Math.PI * y / Math.Pow(2, z);
			return (180 / Math.PI * Math.Atan(0.5 * (Math.Exp(n) - Math.Exp(-n))));
		}
	}
}