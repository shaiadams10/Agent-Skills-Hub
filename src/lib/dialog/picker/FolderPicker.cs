using System;
using System.Runtime.InteropServices;

/// <summary>Native folder picker (IFileOpenDialog + FOS_PICKFOLDERS). exit 0 + path on stdout.</summary>
internal static class Program
{
    private const uint FosPickFolders = 0x20;
    private const uint FosForceFilesystem = 0x40;
    private const uint FosPathMustExist = 0x800;
    private const uint SigdnFilesystemPath = 0x80058000;
    private static readonly Guid FileOpenDialogClsid = new Guid("DC1C5A9C-E88A-4DDE-B5A1-60F82A20AEF7");

    [STAThread]
    private static int Main()
    {
        try
        {
            var path = PickFolder("Select your project folder");
            if (string.IsNullOrEmpty(path))
                return 1;
            Console.Out.Write(path);
            return 0;
        }
        catch
        {
            return 1;
        }
    }

    private static string PickFolder(string title)
    {
        IFileDialog dialog = null;
        IShellItem item = null;
        try
        {
            var dialogType = Type.GetTypeFromCLSID(FileOpenDialogClsid);
            if (dialogType == null)
                return null;

            dialog = (IFileDialog)Activator.CreateInstance(dialogType);
            uint options;
            dialog.GetOptions(out options);
            dialog.SetOptions(options | FosPickFolders | FosForceFilesystem | FosPathMustExist);
            dialog.SetTitle(title);

            if (dialog.Show(IntPtr.Zero) != 0)
                return null;

            dialog.GetFolder(out item);
            string path;
            item.GetDisplayName(SigdnFilesystemPath, out path);
            return path;
        }
        finally
        {
            if (item != null)
                Marshal.ReleaseComObject(item);
            if (dialog != null)
                Marshal.ReleaseComObject(dialog);
        }
    }

    [ComImport]
    [Guid("42f85136-db7e-4396-9a97-7ece7fb4be3c")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IFileDialog
    {
        [PreserveSig]
        int Show(IntPtr parent);

        void SetFileTypes(uint cFileTypes, IntPtr rgFilterSpec);
        void SetFileTypeIndex(uint iFileType);
        void GetFileTypeIndex(out uint piFileType);
        void Advise(IntPtr pfde, out uint pdwCookie);
        void Unadvise(uint dwCookie);
        void SetOptions(uint fos);
        void GetOptions(out uint pfos);
        void SetDefaultFolder(IShellItem psi);
        void SetFolder(IShellItem psi);
        void GetFolder(out IShellItem ppsi);
        void GetCurrentSelection(out IShellItem ppsi);
        void SetFileName([MarshalAs(UnmanagedType.LPWStr)] string pszName);
        void GetFileName([MarshalAs(UnmanagedType.LPWStr)] out string pszName);
        void SetTitle([MarshalAs(UnmanagedType.LPWStr)] string pszTitle);
        void SetOkButtonLabel([MarshalAs(UnmanagedType.LPWStr)] string pszText);
        void SetFileNameLabel([MarshalAs(UnmanagedType.LPWStr)] string pszLabel);
        void AddPlace(uint dwId, IntPtr pidl);
        void SetDefaultExtension([MarshalAs(UnmanagedType.LPWStr)] string pszDefaultExtension);
        void Close(int hr);
        void SetClientGuid(ref Guid guid);
        void ClearClientData();
        void SetFilter(IntPtr pFilter);
    }

    [ComImport]
    [Guid("43826d1e-e1ee-48bd-a1e0-c7e0b3529144")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IShellItem
    {
        void BindToHandler(IntPtr pbc, ref Guid bhid, ref Guid riid, out IntPtr ppv);
        void GetParent(out IShellItem ppsi);
        void GetDisplayName(uint sigdnName, [MarshalAs(UnmanagedType.LPWStr)] out string ppszName);
        void GetAttributes(uint sfgaoMask, out uint psfgaoAttribs);
        void Compare(IShellItem psi, uint hint, out int piOrder);
    }
}
