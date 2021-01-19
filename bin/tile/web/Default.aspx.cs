using System;
using System.Configuration;

public partial class _Default : System.Web.UI.Page{
	public string title = "";
	protected void Page_Load(object sender, EventArgs e){
		title = ConfigurationManager.AppSettings["ServiceName"];
	}
}