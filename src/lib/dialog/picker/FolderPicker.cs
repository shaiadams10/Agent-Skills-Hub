using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;

/// <summary>Modern Windows shell folder picker. exit 0 + path on stdout; 1 = cancel/error.</summary>
internal static class Program
{
    [STAThread]
    private static int Main()
    {
        try
        {
            var dialog = new NativeFolderDialog();
            dialog.Title = "Open Folder";
            if (dialog.ShowDialog())
            {
                Console.Out.Write(dialog.FileName);
                return 0;
            }
            return 1;
        }
        catch
        {
            // Fallback for older Windows or any COM exception
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            using (var dialog = new FolderBrowserDialog())
            {
                dialog.Description = "Open Folder";
                dialog.ShowNewFolderButton = true;
                if (dialog.ShowDialog() == DialogResult.OK && !string.IsNullOrWhiteSpace(dialog.SelectedPath))
                {
                    Console.Out.Write(dialog.SelectedPath);
                    return 0;
                }
                return 1;
            }
        }
    }
}

public class NativeFolderDialog
{
    public string Title { get; set; }
    public string FileName { get; private set; }

    public bool ShowDialog()
    {
        IFileOpenDialog dialog = null;
        try
        {
            dialog = new FileOpenDialog() as IFileOpenDialog;
            if (dialog != null)
            {
                dialog.SetOptions(FOS.FOS_PICKFOLDERS | FOS.FOS_FORCEFILESYSTEM);
                if (!string.IsNullOrEmpty(Title))
                {
                    dialog.SetTitle(Title);
                }

                uint hr = dialog.Show(IntPtr.Zero);
                if (hr == 0) // S_OK
                {
                    IShellItem item;
                    dialog.GetResult(out item);
                    string path;
                    item.GetDisplayName(SIGDN.SIGDN_FILESYSPATH, out path);
                    FileName = path;
                    return true;
                }
                return false;
            }
        }
        finally
        {
            if (dialog != null)
            {
                Marshal.ReleaseComObject(dialog);
            }
        }
        return false;
    }

    [ComImport]
    [ClassInterface(ClassInterfaceType.None)]
    [TypeLibType(TypeLibTypeFlags.FCanCreate)]
    [Guid("DC1C5A9C-E88A-4dde-A5A1-60F82A20AEF7")]
    private class FileOpenDialog { }

    [ComImport]
    [Guid("42f85136-db7e-439c-85f1-e4075d135fc8")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IFileOpenDialog
    {
        [PreserveSig] uint Show([In] IntPtr parent);
        void SetFileTypes([In] uint cFileTypes, [In] IntPtr rgFilterSpec);
        void SetFileTypeIndex([In] uint iFileType);
        void GetFileTypeIndex(out uint piFileType);
        void Advise([In] IntPtr pfde, out uint pdwCookie);
        void Unadvise([In] uint dwCookie);
        void SetOptions([In] FOS fos);
        void GetOptions(out FOS pfos);
        void SetDefaultFolder([In] IShellItem psi);
        void SetFolder([In] IShellItem psi);
        void GetFolder(out IShellItem ppsi);
        void GetCurrentSelection(out IShellItem ppsi);
        void SetFileName([In, MarshalAs(UnmanagedType.LPWStr)] string pszName);
        void GetFileName([MarshalAs(UnmanagedType.LPWStr)] out string pszName);
        void SetTitle([In, MarshalAs(UnmanagedType.LPWStr)] string pszTitle);
        void SetOkButtonLabel([In, MarshalAs(UnmanagedType.LPWStr)] string pszText);
        void SetFileNameLabel([In, MarshalAs(UnmanagedType.LPWStr)] string pszLabel);
        void GetResult(out IShellItem ppsi);
        void AddPlace([In] IShellItem psi, int fdap);
        void SetDefaultExtension([In, MarshalAs(UnmanagedType.LPWStr)] string pszDefaultExtension);
        void Close([MarshalAs(UnmanagedType.Error)] int hr);
        void SetClientGuid([In] ref Guid guid);
        void ClearClientData();
        void SetFilter([In] IntPtr pFilter);
        void GetResults([MarshalAs(UnmanagedType.Interface)] out IntPtr ppenum);
        void GetSelectedItems([MarshalAs(UnmanagedType.Interface)] out IntPtr ppsai);
    }

    [ComImport]
    [Guid("43826D1E-E718-42EE-BC55-A1E261C37BFE")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IShellItem
    {
        void BindToHandler([In] IntPtr pbc, [In] ref Guid bhid, [In] ref Guid riid, out IntPtr ppv);
        void GetParent(out IShellItem ppsi);
        void GetDisplayName([In] SIGDN sigdnName, [MarshalAs(UnmanagedType.LPWStr)] out string ppszName);
        void GetAttributes([In] uint sfgaoMask, out uint psfgaoAttribs);
        void Compare([In] IShellItem psi, [In] uint hint, out int piOrder);
    }

    [Flags]
    private enum FOS : uint
    {
        FOS_FORCEFILESYSTEM = 0x00000040,
        FOS_PICKFOLDERS = 0x00000020
    }

    private enum SIGDN : uint
    {
        SIGDN_FILESYSPATH = 0x80058000
    }
}
