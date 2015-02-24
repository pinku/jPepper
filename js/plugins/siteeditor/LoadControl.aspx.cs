using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class jpepper_plugins_siteeditor_loadcontrol : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["c"] == null)
        {
            Response.Write("Error: you must provide e module code.");
        }

        if (Request.QueryString["c"] != null)
        {
            string code = Request.QueryString["c"].ToString();

            Control c = Page.LoadControl(string.Format("details\\{0}.ascx", code));

            this.Controls.Add(c);
        }
    }
}