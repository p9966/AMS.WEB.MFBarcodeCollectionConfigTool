/**********************************************************************
 * FileName :      FrmWriteToMF
 * Tables :        none
 * Author :        Simple
 * CreateTime :    2018/11/9 12:58:32
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
using System.Text;
using System.Web;
using System.Windows.Forms;

namespace AMS.WEB.BrowserDownloadPlugin
{
    public partial class FrmWriteToMF : Form
    {
        public FrmWriteToMF()
        {
            InitializeComponent();
        }

        public FrmWriteToMF(string config)
        {
            InitializeComponent();
            string l_strDemo = HttpUtility.UrlDecode(config);
            m_strConfig = l_strDemo.Replace("p9966", "\r\n").TrimEnd(new char[] { '/' });

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

        string m_strConfig;
        string m_strMFDriveName;

        #region FrmEvent
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            e.Graphics.DrawRectangle(new Pen(Color.FromArgb(60, 60, 60)), 0, 0, this.Width - 1, this.Height - 1);
        }

        private void FrmWriteToMF_Load(object sender, EventArgs e)
        {
            this.Left = Screen.PrimaryScreen.WorkingArea.Width / 2 - this.Width / 2;
            this.Top = Screen.PrimaryScreen.WorkingArea.Height / 2 - this.Height / 2;

            // 判断MF是否存在
            if (!MFIsExsist(out m_strMFDriveName))
            {
                MessageBox.Show("MF盘点机没有连接到电脑!", "Aimasen", MessageBoxButtons.OK, MessageBoxIcon.Information);
                Environment.Exit(0);
                return;
            }

            File.WriteAllBytes(m_strMFDriveName + "MF配置文件.txt", Encoding.Default.GetBytes(m_strConfig));
            Timer l_tmrLoad = new Timer();
            l_tmrLoad.Interval = 10;
            l_tmrLoad.Tick += ((snd, evt) =>
            {
                proBarLoad.Value += 1;
                if (proBarLoad.Value >= proBarLoad.Maximum)
                {
                    l_tmrLoad.Stop();
                    l_tmrLoad.Dispose();
                    lbMsg.Text = "写入MF成功,请在MF机器上按\"C\"重启即可";
                    btnOK.Visible = btnOpen.Visible = true;
                }
            });
            l_tmrLoad.Start();
        }
        #endregion

        #region Function
        bool MFIsExsist(out string mfDrivePath)
        {
            bool l_bIsExsist = false;
            mfDrivePath = "";
            DriveInfo[] l_driInfo = DriveInfo.GetDrives();
            for (int i = 0; i < l_driInfo.Length; i++)
            {
                try
                {
                    if (l_driInfo[i].TotalSize > (1024 * 1024 * 120))
                    {
                        continue;
                    }
                    l_bIsExsist = true;
                    mfDrivePath = l_driInfo[i].Name;
                }
                catch { }
            }

            return l_bIsExsist;
        }
        #endregion

        private void btnOpen_Click(object sender, EventArgs e)
        {
            Process.Start(m_strMFDriveName);
            Environment.Exit(0);
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            Environment.Exit(0);
        }

    }
}
