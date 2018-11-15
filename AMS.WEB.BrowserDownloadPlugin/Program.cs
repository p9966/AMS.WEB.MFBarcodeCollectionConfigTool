using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace AMS.WEB.BrowserDownloadPlugin
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            if (args.Length <= 0)
            {
                // 没有参数 注册界面
                Application.Run(new FrmWriteRegedit());
            }
            else
            {
                // 存在参数 编译烧写到盘点机界面
                Application.Run(new FrmWriteToMF(args[0].Split(new string[] { "//" }, StringSplitOptions.None)[1]));
            }
        }
    }
}
