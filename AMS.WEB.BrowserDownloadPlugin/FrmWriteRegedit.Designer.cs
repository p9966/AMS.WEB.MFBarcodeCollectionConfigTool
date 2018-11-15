namespace AMS.WEB.BrowserDownloadPlugin
{
    partial class FrmWriteRegedit
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmWriteRegedit));
            this.label1 = new System.Windows.Forms.Label();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.txtDes = new System.Windows.Forms.TextBox();
            this.lnkTxtOK = new System.Windows.Forms.LinkLabel();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Dock = System.Windows.Forms.DockStyle.Top;
            this.label1.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label1.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(200)))), ((int)(((byte)(200)))), ((int)(((byte)(200)))));
            this.label1.Location = new System.Drawing.Point(1, 1);
            this.label1.Name = "label1";
            this.label1.Padding = new System.Windows.Forms.Padding(1, 10, 0, 0);
            this.label1.Size = new System.Drawing.Size(98, 30);
            this.label1.TabIndex = 0;
            this.label1.Text = "ConfigTools";
            // 
            // pictureBox1
            // 
            this.pictureBox1.BackgroundImage = ((System.Drawing.Image)(resources.GetObject("pictureBox1.BackgroundImage")));
            this.pictureBox1.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.pictureBox1.Location = new System.Drawing.Point(217, 57);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(117, 65);
            this.pictureBox1.TabIndex = 1;
            this.pictureBox1.TabStop = false;
            // 
            // txtDes
            // 
            this.txtDes.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(40)))), ((int)(((byte)(40)))), ((int)(((byte)(40)))));
            this.txtDes.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtDes.Enabled = false;
            this.txtDes.Font = new System.Drawing.Font("微软雅黑", 9.5F);
            this.txtDes.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(190)))), ((int)(((byte)(190)))), ((int)(((byte)(190)))));
            this.txtDes.Location = new System.Drawing.Point(31, 162);
            this.txtDes.Multiline = true;
            this.txtDes.Name = "txtDes";
            this.txtDes.ReadOnly = true;
            this.txtDes.Size = new System.Drawing.Size(475, 148);
            this.txtDes.TabIndex = 2;
            this.txtDes.Text = "  你好，我是小艾。主要负责您在Web上设计的UI界面与盘点机之间的通讯功能。以后当你设计完一个盘点机UI界面并连接盘点机到电脑后点击题头的第二个图标就可以直接将" +
    "设计好的界面直接烧写到盘点机里面啦 最后感谢您的使用与支持！在使用过程中有任何意见或建议请点击浏览器最上方的“报个bug”进行反馈";
            // 
            // lnkTxtOK
            // 
            this.lnkTxtOK.AutoSize = true;
            this.lnkTxtOK.Font = new System.Drawing.Font("微软雅黑", 9.5F);
            this.lnkTxtOK.LinkColor = System.Drawing.Color.FromArgb(((int)(((byte)(200)))), ((int)(((byte)(200)))), ((int)(((byte)(200)))));
            this.lnkTxtOK.Location = new System.Drawing.Point(384, 319);
            this.lnkTxtOK.Name = "lnkTxtOK";
            this.lnkTxtOK.Size = new System.Drawing.Size(122, 21);
            this.lnkTxtOK.TabIndex = 3;
            this.lnkTxtOK.TabStop = true;
            this.lnkTxtOK.Text = "好的，我知道了";
            this.lnkTxtOK.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.lnkTxtOK_LinkClicked);
            // 
            // FrmWriteRegedit
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(40)))), ((int)(((byte)(40)))), ((int)(((byte)(40)))));
            this.ClientSize = new System.Drawing.Size(550, 369);
            this.Controls.Add(this.lnkTxtOK);
            this.Controls.Add(this.txtDes);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "FrmWriteRegedit";
            this.Opacity = 0D;
            this.Padding = new System.Windows.Forms.Padding(1);
            this.ShowInTaskbar = false;
            this.Text = "FrmWriteRegedit";
            this.TopMost = true;
            this.Load += new System.EventHandler(this.FrmWriteRegedit_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.TextBox txtDes;
        private System.Windows.Forms.LinkLabel lnkTxtOK;

    }
}