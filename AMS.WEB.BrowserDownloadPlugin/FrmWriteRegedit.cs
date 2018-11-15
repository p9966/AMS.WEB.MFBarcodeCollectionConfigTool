/**********************************************************************
 * FileName :      FrmWriteRegedit
 * Tables :        none
 * Author :        Simple
 * CreateTime :    2018/11/9 11:10:26
 * Description :   Love life love programming
 * 
 * Revision History
 * Author           ModifyTime          Description
 * 
 **********************************************************************/

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace AMS.WEB.BrowserDownloadPlugin
{
    public partial class FrmWriteRegedit : Form
    {
        public FrmWriteRegedit()
        {
            InitializeComponent();
        }

        #region FrmEvent
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            e.Graphics.DrawRectangle(new Pen(Color.FromArgb(60, 60, 60)), 0, 0, this.Width - 1, this.Height - 1);
        }

        private void FrmWriteRegedit_Load(object sender, EventArgs e)
        {
            this.Left = Screen.PrimaryScreen.WorkingArea.Width / 2 - this.Width / 2;
            this.Top = Screen.PrimaryScreen.WorkingArea.Height / 2 - this.Height / 2;
            Reg();

            System.Windows.Forms.Timer l_tmr = new System.Windows.Forms.Timer();
            l_tmr.Interval = 10;
            l_tmr.Tick += (snd, evt) =>
            {
                this.Opacity += 0.03;
                if (this.Opacity >= 1.0)
                {
                    l_tmr.Stop();
                    l_tmr.Dispose();
                }
            };
            l_tmr.Start();
        }
        #endregion

        #region Function
        /// <summary>
        /// 注册启动项到注册表
        /// </summary>
        public void Reg()
        {
            //注册的协议头，即在地址栏中的路径 如QQ的：tencent://xxxxx/xxx 我注册的是jun 在地址栏中输入：jun:// 就能打开本程序
            var surekamKey = Microsoft.Win32.Registry.ClassesRoot.CreateSubKey("Aimasen");
            //以下这些参数都是固定的，不需要更改，直接复制过去 
            var shellKey = surekamKey.CreateSubKey("shell");
            var openKey = shellKey.CreateSubKey("open");
            var commandKey = openKey.CreateSubKey("command");
            surekamKey.SetValue("URL Protocol", "");
            //这里可执行文件取当前程序全路径，可根据需要修改
            string l_strName = "C:\\AmsConfigTools.exe";
            if (File.Exists(l_strName))
                File.Delete(l_strName);
            File.Copy(Assembly.GetEntryAssembly().Location, l_strName);
            commandKey.SetValue("", "\"" + l_strName + "\"" + " \"%1\"");
        }
        #endregion

        private void lnkTxtOK_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            Environment.Exit(0);
        }
    }
}
