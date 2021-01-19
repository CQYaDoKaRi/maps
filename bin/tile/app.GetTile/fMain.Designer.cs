namespace GetTile
{
    partial class fMain
    {
        /// <summary>
        /// 必要なデザイナー変数です。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 使用中のリソースをすべてクリーンアップします。
        /// </summary>
        /// <param name="disposing">マネージ リソースが破棄される場合 true、破棄されない場合は false です。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows フォーム デザイナーで生成されたコード

        /// <summary>
        /// デザイナー サポートに必要なメソッドです。このメソッドの内容を
        /// コード エディターで変更しないでください。
        /// </summary>
        private void InitializeComponent()
        {
            this.iX_S = new System.Windows.Forms.TextBox();
            this.lX = new System.Windows.Forms.Label();
            this.lY = new System.Windows.Forms.Label();
            this.iY_S = new System.Windows.Forms.TextBox();
            this.lX_ = new System.Windows.Forms.Label();
            this.lY_ = new System.Windows.Forms.Label();
            this.iX_E = new System.Windows.Forms.TextBox();
            this.iY_E = new System.Windows.Forms.TextBox();
            this.lZ = new System.Windows.Forms.Label();
            this.iZ = new System.Windows.Forms.ComboBox();
            this.lURL = new System.Windows.Forms.Label();
            this.iURL = new System.Windows.Forms.TextBox();
            this.BT_Proc = new System.Windows.Forms.Button();
            this.iSaveDir = new System.Windows.Forms.TextBox();
            this.lSaveDir = new System.Windows.Forms.Label();
            this.BT_Save = new System.Windows.Forms.Button();
            this.iLat_E = new System.Windows.Forms.TextBox();
            this.iLon_E = new System.Windows.Forms.TextBox();
            this.lLat_ = new System.Windows.Forms.Label();
            this.lLon_ = new System.Windows.Forms.Label();
            this.lLat = new System.Windows.Forms.Label();
            this.iLat_S = new System.Windows.Forms.TextBox();
            this.lLon = new System.Windows.Forms.Label();
            this.iLon_S = new System.Windows.Forms.TextBox();
            this.iPosType_LonLat = new System.Windows.Forms.RadioButton();
            this.iPosType_XY = new System.Windows.Forms.RadioButton();
            this.gPosType_LonLat = new System.Windows.Forms.GroupBox();
            this.gPosType_XY = new System.Windows.Forms.GroupBox();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.Status = new System.Windows.Forms.ToolStripStatusLabel();
            this.ProgressBar = new System.Windows.Forms.ToolStripProgressBar();
            this.backgroundWorker = new System.ComponentModel.BackgroundWorker();
            this.gPosType_LonLat.SuspendLayout();
            this.gPosType_XY.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.SuspendLayout();
            // 
            // iX_S
            // 
            this.iX_S.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iX_S.Location = new System.Drawing.Point(46, 24);
            this.iX_S.MaxLength = 6;
            this.iX_S.Name = "iX_S";
            this.iX_S.Size = new System.Drawing.Size(70, 19);
            this.iX_S.TabIndex = 9;
            this.iX_S.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // lX
            // 
            this.lX.AutoSize = true;
            this.lX.Location = new System.Drawing.Point(15, 27);
            this.lX.Name = "lX";
            this.lX.Size = new System.Drawing.Size(12, 12);
            this.lX.TabIndex = 1;
            this.lX.Text = "X";
            // 
            // lY
            // 
            this.lY.AutoSize = true;
            this.lY.Location = new System.Drawing.Point(15, 52);
            this.lY.Name = "lY";
            this.lY.Size = new System.Drawing.Size(12, 12);
            this.lY.TabIndex = 3;
            this.lY.Text = "Y";
            // 
            // iY_S
            // 
            this.iY_S.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iY_S.Location = new System.Drawing.Point(46, 49);
            this.iY_S.MaxLength = 6;
            this.iY_S.Name = "iY_S";
            this.iY_S.Size = new System.Drawing.Size(70, 19);
            this.iY_S.TabIndex = 11;
            this.iY_S.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // lX_
            // 
            this.lX_.AutoSize = true;
            this.lX_.Location = new System.Drawing.Point(122, 27);
            this.lX_.Name = "lX_";
            this.lX_.Size = new System.Drawing.Size(11, 12);
            this.lX_.TabIndex = 4;
            this.lX_.Text = "-";
            // 
            // lY_
            // 
            this.lY_.AutoSize = true;
            this.lY_.Location = new System.Drawing.Point(122, 52);
            this.lY_.Name = "lY_";
            this.lY_.Size = new System.Drawing.Size(11, 12);
            this.lY_.TabIndex = 5;
            this.lY_.Text = "-";
            // 
            // iX_E
            // 
            this.iX_E.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iX_E.Location = new System.Drawing.Point(139, 24);
            this.iX_E.MaxLength = 6;
            this.iX_E.Name = "iX_E";
            this.iX_E.Size = new System.Drawing.Size(70, 19);
            this.iX_E.TabIndex = 10;
            this.iX_E.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // iY_E
            // 
            this.iY_E.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iY_E.Location = new System.Drawing.Point(139, 49);
            this.iY_E.MaxLength = 6;
            this.iY_E.Name = "iY_E";
            this.iY_E.Size = new System.Drawing.Size(70, 19);
            this.iY_E.TabIndex = 12;
            this.iY_E.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // lZ
            // 
            this.lZ.AutoSize = true;
            this.lZ.Location = new System.Drawing.Point(16, 44);
            this.lZ.Name = "lZ";
            this.lZ.Size = new System.Drawing.Size(12, 12);
            this.lZ.TabIndex = 9;
            this.lZ.Text = "Z";
            // 
            // iZ
            // 
            this.iZ.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.iZ.FormattingEnabled = true;
            this.iZ.Items.AddRange(new object[] {
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18"});
            this.iZ.Location = new System.Drawing.Point(48, 39);
            this.iZ.Name = "iZ";
            this.iZ.Size = new System.Drawing.Size(50, 20);
            this.iZ.TabIndex = 2;
            this.iZ.SelectedIndexChanged += new System.EventHandler(this.iZ_SelectedIndexChanged);
            // 
            // lURL
            // 
            this.lURL.AutoSize = true;
            this.lURL.Location = new System.Drawing.Point(17, 17);
            this.lURL.Name = "lURL";
            this.lURL.Size = new System.Drawing.Size(27, 12);
            this.lURL.TabIndex = 12;
            this.lURL.Text = "URL";
            // 
            // iURL
            // 
            this.iURL.Location = new System.Drawing.Point(48, 14);
            this.iURL.MaxLength = 1000;
            this.iURL.Name = "iURL";
            this.iURL.Size = new System.Drawing.Size(411, 19);
            this.iURL.TabIndex = 1;
            this.iURL.TextChanged += new System.EventHandler(this.iURL_TextChanged);
            // 
            // BT_Proc
            // 
            this.BT_Proc.Location = new System.Drawing.Point(12, 276);
            this.BT_Proc.Name = "BT_Proc";
            this.BT_Proc.Size = new System.Drawing.Size(447, 33);
            this.BT_Proc.TabIndex = 15;
            this.BT_Proc.Text = "取得(&R)";
            this.BT_Proc.UseVisualStyleBackColor = true;
            this.BT_Proc.Click += new System.EventHandler(this.BT_Proc_Click);
            // 
            // iSaveDir
            // 
            this.iSaveDir.ForeColor = System.Drawing.Color.Black;
            this.iSaveDir.Location = new System.Drawing.Point(48, 246);
            this.iSaveDir.MaxLength = 1000;
            this.iSaveDir.Name = "iSaveDir";
            this.iSaveDir.Size = new System.Drawing.Size(347, 19);
            this.iSaveDir.TabIndex = 13;
            // 
            // lSaveDir
            // 
            this.lSaveDir.AutoSize = true;
            this.lSaveDir.Location = new System.Drawing.Point(16, 249);
            this.lSaveDir.Name = "lSaveDir";
            this.lSaveDir.Size = new System.Drawing.Size(29, 12);
            this.lSaveDir.TabIndex = 17;
            this.lSaveDir.Text = "保存";
            // 
            // BT_Save
            // 
            this.BT_Save.Location = new System.Drawing.Point(401, 244);
            this.BT_Save.Name = "BT_Save";
            this.BT_Save.Size = new System.Drawing.Size(58, 23);
            this.BT_Save.TabIndex = 14;
            this.BT_Save.Text = "参照(&S)";
            this.BT_Save.UseVisualStyleBackColor = true;
            this.BT_Save.Click += new System.EventHandler(this.BT_Save_Click);
            // 
            // iLat_E
            // 
            this.iLat_E.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iLat_E.Location = new System.Drawing.Point(139, 46);
            this.iLat_E.MaxLength = 10;
            this.iLat_E.Name = "iLat_E";
            this.iLat_E.Size = new System.Drawing.Size(70, 19);
            this.iLat_E.TabIndex = 7;
            this.iLat_E.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // iLon_E
            // 
            this.iLon_E.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iLon_E.Location = new System.Drawing.Point(139, 21);
            this.iLon_E.MaxLength = 11;
            this.iLon_E.Name = "iLon_E";
            this.iLon_E.Size = new System.Drawing.Size(70, 19);
            this.iLon_E.TabIndex = 5;
            this.iLon_E.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // lLat_
            // 
            this.lLat_.AutoSize = true;
            this.lLat_.Location = new System.Drawing.Point(122, 49);
            this.lLat_.Name = "lLat_";
            this.lLat_.Size = new System.Drawing.Size(11, 12);
            this.lLat_.TabIndex = 24;
            this.lLat_.Text = "-";
            // 
            // lLon_
            // 
            this.lLon_.AutoSize = true;
            this.lLon_.Location = new System.Drawing.Point(122, 24);
            this.lLon_.Name = "lLon_";
            this.lLon_.Size = new System.Drawing.Size(11, 12);
            this.lLon_.TabIndex = 23;
            this.lLon_.Text = "-";
            // 
            // lLat
            // 
            this.lLat.AutoSize = true;
            this.lLat.Location = new System.Drawing.Point(11, 49);
            this.lLat.Name = "lLat";
            this.lLat.Size = new System.Drawing.Size(29, 12);
            this.lLat.TabIndex = 20;
            this.lLat.Text = "経度";
            // 
            // iLat_S
            // 
            this.iLat_S.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iLat_S.Location = new System.Drawing.Point(46, 46);
            this.iLat_S.MaxLength = 10;
            this.iLat_S.Name = "iLat_S";
            this.iLat_S.Size = new System.Drawing.Size(70, 19);
            this.iLat_S.TabIndex = 6;
            this.iLat_S.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // lLon
            // 
            this.lLon.AutoSize = true;
            this.lLon.Location = new System.Drawing.Point(11, 24);
            this.lLon.Name = "lLon";
            this.lLon.Size = new System.Drawing.Size(29, 12);
            this.lLon.TabIndex = 19;
            this.lLon.Text = "緯度";
            // 
            // iLon_S
            // 
            this.iLon_S.ImeMode = System.Windows.Forms.ImeMode.Disable;
            this.iLon_S.Location = new System.Drawing.Point(46, 21);
            this.iLon_S.MaxLength = 11;
            this.iLon_S.Name = "iLon_S";
            this.iLon_S.Size = new System.Drawing.Size(70, 19);
            this.iLon_S.TabIndex = 4;
            this.iLon_S.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // iPosType_LonLat
            // 
            this.iPosType_LonLat.AutoSize = true;
            this.iPosType_LonLat.Location = new System.Drawing.Point(6, -1);
            this.iPosType_LonLat.Name = "iPosType_LonLat";
            this.iPosType_LonLat.Size = new System.Drawing.Size(71, 16);
            this.iPosType_LonLat.TabIndex = 3;
            this.iPosType_LonLat.TabStop = true;
            this.iPosType_LonLat.Text = "緯度経度";
            this.iPosType_LonLat.UseVisualStyleBackColor = true;
            this.iPosType_LonLat.CheckedChanged += new System.EventHandler(this.iPosType_LonLat_CheckedChanged);
            // 
            // iPosType_XY
            // 
            this.iPosType_XY.AutoSize = true;
            this.iPosType_XY.Location = new System.Drawing.Point(6, 0);
            this.iPosType_XY.Name = "iPosType_XY";
            this.iPosType_XY.Size = new System.Drawing.Size(74, 16);
            this.iPosType_XY.TabIndex = 8;
            this.iPosType_XY.TabStop = true;
            this.iPosType_XY.Text = "タイル番号";
            this.iPosType_XY.UseVisualStyleBackColor = true;
            this.iPosType_XY.CheckedChanged += new System.EventHandler(this.iPosType_XY_CheckedChanged);
            // 
            // gPosType_LonLat
            // 
            this.gPosType_LonLat.Controls.Add(this.lLon);
            this.gPosType_LonLat.Controls.Add(this.iLon_S);
            this.gPosType_LonLat.Controls.Add(this.iPosType_LonLat);
            this.gPosType_LonLat.Controls.Add(this.iLat_E);
            this.gPosType_LonLat.Controls.Add(this.iLat_S);
            this.gPosType_LonLat.Controls.Add(this.iLon_E);
            this.gPosType_LonLat.Controls.Add(this.lLat);
            this.gPosType_LonLat.Controls.Add(this.lLat_);
            this.gPosType_LonLat.Controls.Add(this.lLon_);
            this.gPosType_LonLat.Location = new System.Drawing.Point(18, 70);
            this.gPosType_LonLat.Name = "gPosType_LonLat";
            this.gPosType_LonLat.Size = new System.Drawing.Size(441, 78);
            this.gPosType_LonLat.TabIndex = 29;
            this.gPosType_LonLat.TabStop = false;
            // 
            // gPosType_XY
            // 
            this.gPosType_XY.Controls.Add(this.lX);
            this.gPosType_XY.Controls.Add(this.iPosType_XY);
            this.gPosType_XY.Controls.Add(this.iX_S);
            this.gPosType_XY.Controls.Add(this.iY_S);
            this.gPosType_XY.Controls.Add(this.lY);
            this.gPosType_XY.Controls.Add(this.lX_);
            this.gPosType_XY.Controls.Add(this.lY_);
            this.gPosType_XY.Controls.Add(this.iX_E);
            this.gPosType_XY.Controls.Add(this.iY_E);
            this.gPosType_XY.Location = new System.Drawing.Point(18, 157);
            this.gPosType_XY.Name = "gPosType_XY";
            this.gPosType_XY.Size = new System.Drawing.Size(441, 78);
            this.gPosType_XY.TabIndex = 30;
            this.gPosType_XY.TabStop = false;
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.Status,
            this.ProgressBar});
            this.statusStrip.Location = new System.Drawing.Point(0, 318);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(472, 22);
            this.statusStrip.SizingGrip = false;
            this.statusStrip.TabIndex = 31;
            // 
            // Status
            // 
            this.Status.AutoSize = false;
            this.Status.Name = "Status";
            this.Status.Size = new System.Drawing.Size(355, 17);
            this.Status.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // ProgressBar
            // 
            this.ProgressBar.Name = "ProgressBar";
            this.ProgressBar.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.ProgressBar.Size = new System.Drawing.Size(100, 16);
            // 
            // backgroundWorker
            // 
            this.backgroundWorker.WorkerReportsProgress = true;
            this.backgroundWorker.DoWork += new System.ComponentModel.DoWorkEventHandler(this.backgroundWorker_DoWork);
            // 
            // fMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(472, 340);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.gPosType_XY);
            this.Controls.Add(this.BT_Save);
            this.Controls.Add(this.lSaveDir);
            this.Controls.Add(this.iSaveDir);
            this.Controls.Add(this.BT_Proc);
            this.Controls.Add(this.lURL);
            this.Controls.Add(this.iURL);
            this.Controls.Add(this.iZ);
            this.Controls.Add(this.lZ);
            this.Controls.Add(this.gPosType_LonLat);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "fMain";
            this.ShowIcon = false;
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.Text = "タイルデータ取得";
            this.Load += new System.EventHandler(this.fMain_Load);
            this.gPosType_LonLat.ResumeLayout(false);
            this.gPosType_LonLat.PerformLayout();
            this.gPosType_XY.ResumeLayout(false);
            this.gPosType_XY.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox iX_S;
        private System.Windows.Forms.Label lX;
        private System.Windows.Forms.Label lY;
        private System.Windows.Forms.TextBox iY_S;
        private System.Windows.Forms.Label lX_;
        private System.Windows.Forms.Label lY_;
        private System.Windows.Forms.TextBox iX_E;
        private System.Windows.Forms.TextBox iY_E;
        private System.Windows.Forms.Label lZ;
        private System.Windows.Forms.ComboBox iZ;
        private System.Windows.Forms.Label lURL;
        private System.Windows.Forms.TextBox iURL;
        private System.Windows.Forms.Button BT_Proc;
        private System.Windows.Forms.TextBox iSaveDir;
        private System.Windows.Forms.Label lSaveDir;
        private System.Windows.Forms.Button BT_Save;
        private System.Windows.Forms.TextBox iLat_E;
        private System.Windows.Forms.TextBox iLon_E;
        private System.Windows.Forms.Label lLat_;
        private System.Windows.Forms.Label lLon_;
        private System.Windows.Forms.Label lLat;
        private System.Windows.Forms.TextBox iLat_S;
        private System.Windows.Forms.Label lLon;
        private System.Windows.Forms.TextBox iLon_S;
        private System.Windows.Forms.RadioButton iPosType_LonLat;
        private System.Windows.Forms.RadioButton iPosType_XY;
        private System.Windows.Forms.GroupBox gPosType_LonLat;
        private System.Windows.Forms.GroupBox gPosType_XY;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripProgressBar ProgressBar;
        private System.ComponentModel.BackgroundWorker backgroundWorker;
        private System.Windows.Forms.ToolStripStatusLabel Status;
    }
}

