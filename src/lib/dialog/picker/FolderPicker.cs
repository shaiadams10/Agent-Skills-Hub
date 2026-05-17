using System;
using System.Windows.Forms;

/// <summary>Native folder picker. exit 0 + path on stdout; 1 = cancel/error.</summary>
internal static class Program
{
    [STAThread]
    private static int Main()
    {
        try
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            using (var dialog = new FolderBrowserDialog())
            {
                dialog.Description = "Select your project folder";
                dialog.ShowNewFolderButton = true;

                if (dialog.ShowDialog() != DialogResult.OK)
                    return 1;

                var path = dialog.SelectedPath;
                if (string.IsNullOrWhiteSpace(path))
                    return 1;

                Console.Out.Write(path);
                return 0;
            }
        }
        catch
        {
            return 1;
        }
    }
}
