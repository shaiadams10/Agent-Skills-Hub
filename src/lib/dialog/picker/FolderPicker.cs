using System;
using System.Reflection;
using System.Windows.Forms;

/// <summary>Modern Windows shell folder picker. exit 0 + path on stdout; 1 = cancel/error.</summary>
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
                dialog.Description = "Open Folder";
                dialog.ShowNewFolderButton = true;
                EnableModernDialog(dialog);

                if (dialog.ShowDialog() != DialogResult.OK)
                    return 1;

                var path = dialog.SelectedPath;
                if (string.IsNullOrWhiteSpace(path))
                    return 1;

                Console.Out.Write(path);
                return 0;
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex.Message);
            return 1;
        }
    }

    private static void EnableModernDialog(FolderBrowserDialog dialog)
    {
        // Available on newer WinForms; keep reflection so the helper still compiles on .NET Framework csc.
        PropertyInfo autoUpgrade = typeof(FolderBrowserDialog).GetProperty("AutoUpgradeEnabled");
        if (autoUpgrade != null && autoUpgrade.CanWrite)
            autoUpgrade.SetValue(dialog, true, null);

        PropertyInfo useDescriptionForTitle = typeof(FolderBrowserDialog).GetProperty("UseDescriptionForTitle");
        if (useDescriptionForTitle != null && useDescriptionForTitle.CanWrite)
            useDescriptionForTitle.SetValue(dialog, true, null);
    }
}
