function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBytes(k: string): Uint8Array {
  const pad = k.length % 4 === 0 ? "" : "=".repeat(4 - (k.length % 4));
  const b64 = k.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** URL-safe key for SKILL.md absolute path segments. */
export function encodeSkillPathKey(p: string): string {
  return bytesToBase64Url(new TextEncoder().encode(p));
}

export function decodeSkillPathKey(k: string): string {
  try {
    return new TextDecoder().decode(base64UrlToBytes(k));
  } catch {
    throw new Error("invalid skill key");
  }
}
