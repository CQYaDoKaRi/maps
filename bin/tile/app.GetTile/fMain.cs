using System;
using System.ComponentModel;
using System.Windows.Forms;
using System.Net;
using System.IO;
using Maps;

namespace GetTile
{
    public partial class fMain : Form
    {
        public fMain() {
            InitializeComponent();
        }

        private string fLog = "";

        /// <summary>
        /// メイン
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void fMain_Load(object sender, EventArgs e) {
            fLog = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "\\download.txt";

            this.backgroundWorker.ProgressChanged += backgroundWorker_ProgressChanged;
            this.backgroundWorker.RunWorkerCompleted += backgroundWorker_RunWorkerCompleted;

            iLon_S.LostFocus += iLon_S_LostFocus;
            iLon_E.LostFocus += iLon_E_LostFocus;
            iLat_S.LostFocus += iLat_S_LostFocus;
            iLat_E.LostFocus += iLat_E_LostFocus;
            iX_S.LostFocus += iX_S_LostFocus;
            iX_E.LostFocus += iX_E_LostFocus;
            iY_S.LostFocus += iY_S_LostFocus;
            iY_E.LostFocus += iY_E_LostFocus;
            iSaveDir.TextChanged += iSaveDir_TextChanged;

            string dir = System.Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
            iSaveDir.Text = dir;

            iPosType_LonLat.Checked = true;

#if false // テスト：新宿周辺
            iURL.Text = "http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
            iZ.SelectedIndex = 15;
            iLon_S.Text = "139.6922851";
            iLon_E.Text = "139.8021484";
            iLat_S.Text = "35.755428";
            iLat_E.Text = "35.666222";
            iPosType_LonLat.Checked = true;
#endif

            ePos();
            eProc();
        }

        private void iURL_TextChanged(object sender, EventArgs e) {
            eProc();
        }

        private void iZ_SelectedIndexChanged(object sender, EventArgs e) {
            ePos();
            eProc();
        }

        private void iPosType_LonLat_CheckedChanged(object sender, EventArgs e) {
            if (iPosType_LonLat.Checked) {
                iPosType_XY.Checked = false;

                iPosType(true, false);
            }
        }

        private void iPosType_XY_CheckedChanged(object sender, EventArgs e) {
            if (iPosType_XY.Checked) {
                iPosType_LonLat.Checked = false;

                iPosType(false, true);
            }
        }

        private void iLon_S_LostFocus(object sender, EventArgs e) {
            iLonLat2XY(iLon_S, iX_S, "Lon");
            eProc();
        }
        private void iLon_E_LostFocus(object sender, EventArgs e) {
            iLonLat2XY(iLon_E, iX_E, "Lon");
            eProc();
        }
        private void iLat_S_LostFocus(object sender, EventArgs e) {
            iLonLat2XY(iLat_S, iY_S, "Lat");
            eProc();
        }
        private void iLat_E_LostFocus(object sender, EventArgs e) {
            iLonLat2XY(iLat_E, iY_E, "Lat");
            eProc();
        }
        private void iX_S_LostFocus(object sender, EventArgs e) {
            iXY2LonLat(iX_S, iLon_S, "X");
            eProc();
        }
        private void iX_E_LostFocus(object sender, EventArgs e) {
            iXY2LonLat(iX_E, iLon_E, "X");
            eProc();
        }
        private void iY_S_LostFocus(object sender, EventArgs e) {
            iXY2LonLat(iY_S, iLat_S, "Y");
            eProc();
        }
        private void iY_E_LostFocus(object sender, EventArgs e) {
            iXY2LonLat(iY_E, iLat_E, "Y");
            eProc();
        }

        private void iLonLat2XY(TextBox src, TextBox dist, string type) {
            if (src.Text != "") {
                try {
                    double p = double.Parse(src.Text);
                    int z = int.Parse(iZ.SelectedItem.ToString());

                    Tile oTile = new Tile();
                    if (type == "Lon") {
                        int n = 0;
                        int px = 0;
                        oTile.GetTileX(p, z, out n, out px);
                        dist.Text = n.ToString();
                    }
                    else if (type == "Lat") {
                        int n = 0;
                        int px = 0;
                        oTile.GetTileY(p, z, out n, out px);
                        dist.Text = n.ToString();
                    }
                }
                catch (Exception) {
                    dist.Text = "";
                }
            }
            else {
                dist.Text = "";
            }
        }

        private void iXY2LonLat(TextBox src, TextBox dist, string type) {
            if (src.Text != "") {
                try {
                    double p = double.Parse(src.Text);
                    int z = int.Parse(iZ.SelectedItem.ToString());

                    Tile oTile = new Tile();

                    if (type == "X") { dist.Text = vRound(oTile.GetTileLon(p, z), 7).ToString(); }
                    else if (type == "Y") { dist.Text = vRound(oTile.GetTileLat(p, z), 6).ToString(); }
                }
                catch (Exception) {
                    dist.Text = "";
                }
            }
            else {
                dist.Text = "";
            }
        }

        private double vRound(double p, int dig) {
            double n = System.Math.Pow(10, dig);
            if (p > 0) {
                return Math.Floor(p * n) / n;
            }
            else {
                return Math.Ceiling(p * n) / n;
            }
        }

        private void iSaveDir_TextChanged(object sender, EventArgs e) {
            eProc();
        }

        private void BT_Save_Click(object sender, EventArgs e) {
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            fbd.Description = "保存フォルダを指定してください。";
            fbd.RootFolder = Environment.SpecialFolder.Desktop;
            fbd.SelectedPath = Environment.SpecialFolder.Desktop.ToString();
            fbd.ShowNewFolderButton = true;
            if (fbd.ShowDialog(this) == DialogResult.OK) {
                iSaveDir.Text = fbd.SelectedPath;
            }
        }

        private void iPosType(bool fLonLat, bool fXY) {
            iLon_S.Enabled = fLonLat;
            iLon_E.Enabled = fLonLat;
            iLat_S.Enabled = fLonLat;
            iLat_E.Enabled = fLonLat;

            iX_S.Enabled = fXY;
            iX_E.Enabled = fXY;
            iY_S.Enabled = fXY;
            iY_E.Enabled = fXY;
        }

        private void ePos() {
            if (iPosType_LonLat.Checked) {
                iLon_S_LostFocus(null, null);
                iLon_E_LostFocus(null, null);
                iLat_S_LostFocus(null, null);
                iLat_E_LostFocus(null, null);
            }
            if (iPosType_XY.Checked) {
                iX_S_LostFocus(null, null);
                iX_E_LostFocus(null, null);
                iY_S_LostFocus(null, null);
                iY_E_LostFocus(null, null);
            }
        }

        private void eProc() {
            var fEnabled = false;
            if (Directory.Exists(iSaveDir.Text)) {
                this.iSaveDir.ForeColor = System.Drawing.Color.Black;
                Status.Text = "";

                if (iZ.SelectedItem != null) {
                    if (iURL.Text != "" &&
                       iZ.SelectedItem.ToString() != "" &&
                       iX_S.Text != "" &&
                       iX_E.Text != "" &&
                       iY_S.Text != "" &&
                       iY_E.Text != ""
                    ) {
                        fEnabled = true;
                    }
                }
            }
            else {
                this.iSaveDir.ForeColor = System.Drawing.Color.Red;
                Status.Text = "　保存フォルダが存在しません";
            }

            BT_Proc.Enabled = fEnabled;
        }

        private void fProc(bool f) {
            iURL.Enabled = f;
            iZ.Enabled = f;
            iPosType_LonLat.Enabled = f;
            iPosType_XY.Enabled = f;
            iSaveDir.Enabled = f;
            BT_Save.Enabled = f;

            if (f) {
                iPosType(iPosType_LonLat.Checked, iPosType_XY.Checked);
            }
            else {
                iPosType(false, false);
            }
        }

        /* ==========================================================================================*/

        int nCur = 0;
        int nMax = 0;
        string vURL = "";
        int vZ = 0;
        int vX_S = 0;
        int vX_E = 0;
        int vY_S = 0;
        int vY_E = 0;
        string vDir = "";
        private void BT_Proc_Click(object sender, EventArgs e) {
            File.Delete(fLog);

            fProc(false);
            BT_Proc.Enabled = false;
            ProgressBar.Style = ProgressBarStyle.Continuous;
            ProgressBar.Value = 0;
            Status.Text = "";

            nCur = 0;
            nMax = 0;

            vURL = iURL.Text;
            vZ = int.Parse(iZ.SelectedItem.ToString());
            vX_S = int.Parse(iX_S.Text);
            vX_E = int.Parse(iX_E.Text);
            vY_S = int.Parse(iY_S.Text);
            vY_E = int.Parse(iY_E.Text);
            vDir = iSaveDir.Text;

            nMax = (vX_E - vX_S + 1) * (vY_E - vY_S + 1);

            backgroundWorker.RunWorkerAsync();
        }

        private void backgroundWorker_DoWork(object sender, DoWorkEventArgs e) {
            BackgroundWorker worker = (BackgroundWorker) sender;

            if (vDir.LastIndexOf("\\") != vDir.Length - 1) {
                vDir += "\\";
            }

            StreamWriter fpw = new StreamWriter(fLog, true);
            for (int nY = vY_S; nY <= vY_E; nY++) {
                for (int nX = vX_S; nX <= vX_E; nX++) {
                    string vURL_GET = vURL.Replace("{z}", vZ.ToString()).Replace("{x}", nX.ToString()).Replace("{y}", nY.ToString());
                    string vSave = vDir + vZ.ToString() + "\\" + nX.ToString() + "\\" + nY + Path.GetExtension(vURL_GET);
                    string vSavePath = Path.GetDirectoryName(vSave);
                    if (!Directory.Exists(vSavePath)) {
                        Directory.CreateDirectory(vSavePath);
                    }

                    string status = "NG";
                    try {
                        WebClient wc = new WebClient();
                        wc.DownloadFile(vURL_GET, vSave);
                        wc.Dispose();

                        status = "OK";
                    }
                    catch (Exception) {
                    }

                    fpw.Write(status + "[" + vURL_GET + "]→[" + vSave + "]\r\n");

                    nCur++;

                    worker.ReportProgress((int) (nCur * 100 / nMax));
                }
            }
            fpw.Close();
            fpw.Dispose();
        }

        void backgroundWorker_ProgressChanged(object sender, System.ComponentModel.ProgressChangedEventArgs e) {
            Status.Text = "　" + nCur + "/" + nMax;
            ProgressBar.Value = e.ProgressPercentage;
        }

        void backgroundWorker_RunWorkerCompleted(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e) {
            ProgressBar.Value = 0;
            ProgressBar.Style = ProgressBarStyle.Blocks;
            Status.Text = "";

            this.Enabled = true;
            fProc(true);
        }

    }
}
