# Windows folder picker (`pick-folder-win.exe`)

Uses the modern Windows shell folder picker through WinForms `FolderBrowserDialog` with `AutoUpgradeEnabled` when available. On current Windows this opens the “Open Folder” / “Select folder” style dialog.

Built from `FolderPicker.cs` with `csc.exe` (no Go/SDK).

```bash
npm run build:picker
```

Output: `../bin/pick-folder-win.exe` (committed so `npm run dev` works without building). Rebuild after editing `FolderPicker.cs`.

Exit codes: `0` = path on stdout, `1` = cancelled.
