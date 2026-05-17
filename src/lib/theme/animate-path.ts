import { interpolate } from "flubber";

function waitFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function animateSvgPath(
  pathEl: SVGPathElement,
  fromD: string,
  toD: string,
  durationMs: number,
  ease: (t: number) => number,
): Promise<void> {
  const blend = interpolate(fromD, toD, { maxSegmentLength: 12 });

  return new Promise((resolve) => {
    const start = performance.now();

    function frame(now: number) {
      const elapsed = now - start;
      let t = durationMs <= 0 ? 1 : Math.min(1, elapsed / durationMs);
      t = ease(t);
      pathEl.setAttribute("d", t >= 1 ? toD : blend(t));
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        pathEl.setAttribute("d", toD);
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

/** Let the browser paint the final frame before teardown (reduces end stutter). */
export async function flushAnimationFrames(count = 2): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    await waitFrame();
  }
}

export function fadeElement(
  el: HTMLElement,
  toOpacity: number,
  durationMs: number,
): Promise<void> {
  return new Promise((resolve) => {
    el.style.transition = `opacity ${durationMs}ms ease-out`;
    el.style.opacity = String(toOpacity);
    window.setTimeout(() => {
      el.style.transition = "";
      if (toOpacity >= 1) el.style.opacity = "";
      resolve();
    }, durationMs);
  });
}
