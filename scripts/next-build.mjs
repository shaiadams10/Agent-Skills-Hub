/**
 * Run `next build`. On Windows, when the repo lives on a different drive than
 * %USERPROFILE% (e.g. D:\Projects\... vs C:\Users\...), Next's file tracer can
 * glob the profile folder and hit EPERM on legacy junctions ("Application Data").
 * Pin HOME/USERPROFILE to the repo for this process only.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.platform === "win32") {
  process.env.HOME = projectRoot;
  process.env.USERPROFILE = projectRoot;
}

const nextBin = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

const result = spawnSync(nextBin, ["build"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
