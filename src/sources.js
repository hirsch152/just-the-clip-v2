// Reads a pasted link and looks up the post's public details (thumbnail,
// caption, account) so the shared link gets a proper preview. Videos are
// always played through X's and Instagram's own official players.

export function parseLink(input) {
  let url;
  try {
    url = new URL(String(input).trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|mobile|m)\./, '').toLowerCase();
  const xHosts = ['x.com', 'twitter.com', 'fxtwitter.com', 'vxtwitter.com', 'fixupx.com'];
  if (xHosts.includes(host)) {
    const m = url.pathname.match(/\/status(?:es)?\/(\d{5,25})/);
    if (m) return { platform: 'x', id: m[1] };
  }
  if (host === 'instagram.com' || host === 'instagr.am') {
    const m = url.pathname.match(/\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]{5,40})/);
    if (m) return { platform: 'ig', id: m[1] };
  }
  return null;
}

function decodeEntities(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function formatDuration(ms) {
  if (!ms) return '';
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// The same public endpoint X's own embed widgets use.
function syndicationToken(id) {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
}

async function fetchX(id) {
  const api = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${syndicationToken(id)}&lang=en`;
  const res = await fetch(api, {
    headers: { accept: 'application/json' },
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  if (!res.ok) return { found: false };
  const t = await res.json();
  if (!t || t.__typename === 'TweetTombstone' || !t.id_str) return { found: false };

  const media = Array.isArray(t.mediaDetails) ? t.mediaDetails : [];
  const vid = media.find((m) => m.type === 'video' || m.type === 'animated_gif');
  const text = decodeEntities(t.text || '').replace(/\s*https:\/\/t\.co\/\w+\s*$/, '').trim();

  return {
    found: true,
    hasVideo: Boolean(vid),
    thumb: (t.video && t.video.poster) || (vid && vid.media_url_https) || (media[0] && media[0].media_url_https) || '',
    caption: text,
    author: (t.user && t.user.name) || '',
    handle: (t.user && t.user.screen_name) || '',
    avatar: ((t.user && t.user.profile_image_url_https) || '').replace('_normal.', '_bigger.'),
    duration: vid && vid.video_info ? formatDuration(vid.video_info.duration_millis) : '',
  };
}

// Instagram has no open details lookup, so this is best effort: it reads the
// public embed page and falls back to a plain preview if that fails.
async function fetchInstagram(code) {
  const res = await fetch(`https://www.instagram.com/p/${code}/embed/captioned/`, {
    headers: { accept: 'text/html' },
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  if (!res.ok) return { found: false };
  const html = await res.text();
  const img = html.match(/class="EmbeddedMediaImage"[^>]*?src="([^"]+)"/);
  const user = html.match(/class="UsernameText"[^>]*>([^<]+)</);
  return {
    found: true,
    hasVideo: true,
    thumb: img ? decodeEntities(img[1]) : '',
    caption: '',
    author: user ? decodeEntities(user[1]) : '',
    handle: user ? decodeEntities(user[1]) : '',
    avatar: '',
    duration: '',
  };
}

export async function getDetails(platform, id) {
  try {
    return platform === 'x' ? await fetchX(id) : await fetchInstagram(id);
  } catch {
    return { found: false };
  }
}
