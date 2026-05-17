"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animateSvgPath, fadeElement, flushAnimationFrames } from "@/lib/theme/animate-path";
import { applySchemeToDocument } from "@/lib/theme/apply-scheme";
import type { ColorScheme } from "@/lib/theme/constants";
import { THEME_MORPH_HIDE_MS, THEME_MORPH_SHOW_MS } from "@/lib/theme/constants";
import { easePower3InOut, easeSmoothInOut } from "@/lib/theme/morph-easing";
import { MORPH_PATH_COVER, MORPH_PATH_FLAT, MORPH_VIEWBOX } from "@/lib/theme/morph-paths";
import { setThemeMorphRunner } from "@/lib/theme/play-morph-transition";
import { backgroundForScheme } from "@/lib/theme/scheme-colors";

export const THEME_CONTENT_ROOT_ID = "theme-content-root";

function clearContentMorphClasses(content: HTMLElement | null) {
  if (!content) return;
  content.classList.remove("theme-morph-content-dim", "theme-morph-content-restore");
}

export function ThemeMorphOverlay() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [fill, setFill] = useState(backgroundForScheme("light"));

  useEffect(() => {
    setMounted(true);

    const run = async (scheme: ColorScheme) => {
      const path = pathRef.current;
      const wrap = wrapRef.current;
      if (!path || !wrap) {
        applySchemeToDocument(scheme);
        return;
      }

      const id = ++runIdRef.current;
      const targetBg = backgroundForScheme(scheme);
      const content = document.getElementById(THEME_CONTENT_ROOT_ID);

      setFill(targetBg);
      path.setAttribute("fill", targetBg);
      path.setAttribute("d", MORPH_PATH_FLAT);
      wrap.style.opacity = "1";

      document.documentElement.classList.add("theme-morph-active");
      clearContentMorphClasses(content);
      content?.classList.add("theme-morph-content-dim");

      await animateSvgPath(path, MORPH_PATH_FLAT, MORPH_PATH_COVER, THEME_MORPH_SHOW_MS, easePower3InOut);
      if (id !== runIdRef.current) return;

      applySchemeToDocument(scheme);

      content?.classList.remove("theme-morph-content-dim");
      content?.classList.add("theme-morph-content-restore");

      await animateSvgPath(path, MORPH_PATH_COVER, MORPH_PATH_FLAT, THEME_MORPH_HIDE_MS, easeSmoothInOut);
      if (id !== runIdRef.current) return;

      await flushAnimationFrames(2);
      if (id !== runIdRef.current) return;

      await fadeElement(wrap, 0, 120);
      if (id !== runIdRef.current) return;

      path.setAttribute("d", MORPH_PATH_FLAT);
      wrap.style.opacity = "1";
      clearContentMorphClasses(content);
      document.documentElement.classList.remove("theme-morph-active");
    };

    setThemeMorphRunner(run);
    return () => setThemeMorphRunner(null);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div ref={wrapRef} className="theme-morph-wrap" aria-hidden>
      <svg
        className="theme-morph-svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox={MORPH_VIEWBOX}
      >
        <path ref={pathRef} fill={fill} d={MORPH_PATH_FLAT} />
      </svg>
    </div>,
    document.body,
  );
}
