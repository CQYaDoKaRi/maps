<%@ WebHandler Language="C#" Class="Handler" %>
using System;
using System.IO;
using System.Web;
using Maps;

public class Handler : IHttpHandler {

	public void ProcessRequest (HttpContext context) {
		string content = "";
		string type = context.Request.QueryString["type"];
		string tx = context.Request.QueryString["x"];
		string ty = context.Request.QueryString["y"];
		string tz = context.Request.QueryString["z"];

		string lat = context.Request.Form["lat"];
		string lng = context.Request.Form["lng"];
		string z = context.Request.Form["z"];

		if(type == "img"){
			string fname = context.Server.MapPath("./Data/" + tz + "/" + tx + "/" + ty + ".png");
			if (File.Exists(fname)) {
				context.Response.ContentType = "image/png";
				context.Response.Flush();
				context.Response.WriteFile(fname);
				context.Response.End();
			}
		}

		try {
			double _lat = double.Parse(lat);
			double _lng = double.Parse(lng);
			int _z = int.Parse(z);

			int x = 0;
			int x_px = 0;
			int y = 0;
			int y_px = 0;

			Tile oTile = new Tile();

			// タイル座標取得
			oTile.GetTileY(_lat, _z, out y, out y_px);
			oTile.GetTileX(_lng, _z, out x, out x_px);

			content = "{\"x\":" + x + ",\"y\":" + y + ",\"x_px\":" + x_px + ",\"y_px\":" + y_px + ",\"z\":" + z + "}";
		}
		catch (Exception){

		}

		context.Response.ContentType = "text/plain";
		context.Response.Write(content);
	}

	public bool IsReusable {
		get {
			return false;
		}
	}

}