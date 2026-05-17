# Windows folder picker (`pick-folder-win.exe`)

Uses **WinForms `FolderBrowserDialog`** (reliable when spawned from the Node dev server). Earlier IFileOpenDialog COM builds exited instantly without showing UI.

Native folder picker via `IFileOpenDialog` (`FOS_PICKFOLDERS`). Built from `FolderPicker.cs` with `csc.exe` (no Go/SDK).

```bash
npm run build:picker
```

Output: `../bin/pick-folder-win.exe` (committed so `npm run dev` works without building). Rebuild after editing `FolderPicker.cs`.

Exit codes: `0` = path on stdout, `1` = cancelled.
