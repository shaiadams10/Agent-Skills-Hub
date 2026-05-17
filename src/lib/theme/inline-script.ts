import { THEME_STORAGE_KEY } from "./constants";

/** Runs before paint to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;
