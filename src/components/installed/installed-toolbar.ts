import { brutalPress } from "@/lib/motion/css";

/** Shared sizing for the three Installed page header actions. */
export const INSTALLED_TOOLBAR_BTN = `inline-flex h-[3.25rem] w-full items-center justify-center gap-2 border-[3px] border-on-background px-3 text-xs font-bold uppercase shadow-brutal hover:brightness-95 disabled:opacity-50 ${brutalPress}`;

export const INSTALLED_TOOLBAR_GRID =
  "grid w-full shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[34rem]";
