using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace AMS.WEB.MFBarcodeCollectionConfigTool
{
    /// <summary>
    /// ReportBug 的摘要说明
    /// </summary>
    public class ReportBug : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string l_strUserName = context.Request["userName"];
            string l_strEmail = context.Request["email"];
            string l_strRecommend = context.Request["recommend"];

            try
            {
                MailMessage l_mailMsg = new MailMessage();
                l_mailMsg.From = new MailAddress("1430732833@qq.com", l_strUserName);
                l_mailMsg.To.Add(new MailAddress("single9966@163.com"));
                l_mailMsg.Subject = "MF在线配置工具-" + l_strUserName + " 的反馈";
                l_mailMsg.Body = "发送人:" + l_strUserName + "<br/>联系人邮箱:" + l_strEmail + "<br/>反馈内容:<br/>" + l_strRecommend;
                l_mailMsg.IsBodyHtml = true;

                SmtpClient l_smtpClient = new SmtpClient();
                l_smtpClient.EnableSsl = true;
                l_smtpClient.Host = "smtp.qq.com";
                l_smtpClient.Port = 587;
                l_smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                l_smtpClient.UseDefaultCredentials = false;
                l_smtpClient.Credentials = new NetworkCredential("1430732833@qq.com", "lmcgmusyozighecc");

                l_smtpClient.Send(l_mailMsg);
                context.Response.Write("ok");
            }
            catch
            {
                context.Response.Write("no");
            }
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