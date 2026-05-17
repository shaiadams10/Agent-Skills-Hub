/** Approximations of GSAP power eases used in the Codrops demo */

export function easePower3InOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Smooth deceleration into rest — better for morph-out finales */
export function easePower2Out(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv;
}

/** Gentle ease-in-out with zero velocity at both ends */
export function easeSmoothInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
