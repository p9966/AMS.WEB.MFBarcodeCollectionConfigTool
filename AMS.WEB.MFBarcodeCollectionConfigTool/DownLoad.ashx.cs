using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AMS.WEB.MFBarcodeCollectionConfigTool
{
    /// <summary>
    /// DownLoad 的摘要说明
    /// </summary>
    public class DownLoad : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/download";
            string l_strDownFile = "MF配置文件.txt";// HttpUtility.UrlEncode("MF配置文件.txt");
            context.Response.AddHeader("Content-Disposition", "attachment;filename=" + l_strDownFile + ";");

            string l_strContent = context.Request["content"].ToString();
            context.Response.Write(l_strContent);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}