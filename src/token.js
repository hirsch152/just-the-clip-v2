// Clip links carry everything they need inside the link itself, so nothing is
// ever stored on the server. The link is signed so nobody can edit the expiry
// time or the name in it.

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str) {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function sign(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
  return toB64url(mac.slice(0, 9)); // 12 characters is plenty for this use
}

// platform: 'x' | 'ig'; id: tweet id or Instagram shortcode; exp: unix seconds
export async function makeToken({ platform, id, exp, name }, secret) {
  const payload = toB64url(enc.encode([platform, id, exp, name || ''].join('|')));
  if (!secret) return payload;
  return payload + '.' + (await sign(secret, payload));
}

export async function readToken(token, secret) {
  const [payload, sig] = String(token).split('.');
  if (!payload) return null;
  if (secret) {
    if (!sig || sig !== (await sign(secret, payload))) return null;
  }
  let parts;
  try {
    parts = dec.decode(fromB64url(payload)).split('|');
  } catch {
    return null;
  }
  const [platform, id, expStr, ...rest] = parts;
  const exp = Number(expStr);
  if (!['x', 'ig'].includes(platform) || !id || !Number.isFinite(exp)) return null;
  return { platform, id, exp, name: rest.join('|') };
}
