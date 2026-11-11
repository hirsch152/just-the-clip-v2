import { makeToken, readToken } from './token.js';
import { parseLink, getDetails } from './sources.js';
import { homePage, viewerPage, messagePage } from './pages.js';

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

function html(body, status = 200, extra = {}) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', ...SECURITY_HEADERS, ...extra },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...SECURITY_HEADERS },
  });
}

function cleanName(s) {
  return String(s || '').replace(/[\u0000-\u001f|<>]/g, '').trim().slice(0, 30);
}

function sponsorFrom(env) {
  if (!env.SPONSOR_NAME) return null;
  return { name: env.SPONSOR_NAME, line: env.SPONSOR_LINE, url: env.SPONSOR_URL, logo: env.SPONSOR_LOGO };
}

async function handleMake(request, env, url) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Something went wrong. Please try again.' }, 400);
  }
  const target = parseLink(body.link);
  if (!target) {
    return json({ error: 'That doesn’t look like a link to a post on X or Instagram. Open the post, tap Share, then Copy link.' }, 400);
  }
  const hours = Number(body.hours) === 24 ? 24 : 48;
  const name = cleanName(body.name);
  const details = await getDetails(target.platform, target.id);

  if (target.platform === 'x' && details.found && !details.hasVideo) {
    return json({ error: 'That post doesn’t have a video in it. Try a post with a video.' }, 400);
  }

  const exp = Math.floor(Date.now() / 1000) + hours * 3600;
  const token = await makeToken({ platform: target.platform, id: target.id, exp, name }, env.LINK_SECRET);
  return json({
    url: `${url.origin}/c/${token}`,
    title: name ? `${name} sent you a video` : 'Someone sent you a video',
    thumb: details.thumb || '',
    duration: details.duration || '',
    hours,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accent = env.ACCENT_COLOR || '#2350E6';

    if (url.pathname === '/' && request.method === 'GET') {
      return html(homePage({ accent }), 200, { 'cache-control': 'public, max-age=300' });
    }

    if (url.pathname === '/api/make' && request.method === 'POST') {
      return handleMake(request, env, url);
    }

    const m = url.pathname.match(/^\/c\/([A-Za-z0-9_.-]{4,400})\/?$/);
    if (m && request.method === 'GET') {
      const clip = await readToken(m[1], env.LINK_SECRET);
      if (!clip) {
        return html(messagePage({ title: 'This link doesn’t work', text: 'It may have been copied incompletely. Ask the person who sent it to send it again.', accent }), 404);
      }
      if (clip.exp * 1000 < Date.now()) {
        return html(messagePage({ title: 'This video has expired', text: 'Videos shared with Just the Clip disappear after a day or two.', accent }), 410);
      }
      const details = await getDetails(clip.platform, clip.id);
      return html(
        viewerPage({ clip, details, url: url.toString(), accent, sponsor: sponsorFrom(env) }),
        200,
        { 'cache-control': 'public, max-age=600' }
      );
    }

    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /c/\n', { headers: { 'content-type': 'text/plain' } });
    }

    return html(messagePage({ title: 'Page not found', text: 'That page doesn’t exist.', accent }), 404);
  },
};
