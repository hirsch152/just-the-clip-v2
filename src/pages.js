// All the pages the app shows, built as plain HTML on the server.

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ICON_PLAY = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="#fff"/></svg>';
const ICON_CLOCK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const ICON_ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_SHARE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"/></svg>';
const ICON_CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E7A4F" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const BIG_PLAY = '<svg width="34" height="34" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 2.6v10.8l8.6-5.4z" fill="#15171C"/></svg>';

const CSS = `
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#F6F7F9;color:#15171C;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;font-size:16px;line-height:1.5}
a{color:#1A3DB3}a:hover{color:#132E86}
.wrap{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:10px;padding:20px 24px}
.top a{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit}
.logo{width:36px;height:36px;border-radius:10px;background:var(--accent);display:flex;align-items:center;justify-content:center;flex:none}
.brand{font-family:'Plus Jakarta Sans',Inter,sans-serif;font-weight:800;font-size:19px;letter-spacing:-.2px}
main{flex:1;display:flex;flex-direction:column;gap:22px;padding:8px 24px 28px}
h1{margin:0;font-family:'Plus Jakarta Sans',Inter,sans-serif;font-weight:800;font-size:32px;line-height:1.12;letter-spacing:-.6px}
.lede{margin:0;color:#4F5562}
.card{background:#fff;border:1px solid #E4E6EB;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:18px}
.field{display:flex;flex-direction:column;gap:8px}
label,.label{font-size:14px;font-weight:600}
.muted{font-weight:400;color:#5B6170}
.hint{font-size:13px;color:#5B6170}
.inputrow{display:flex;align-items:center;gap:8px;border:1.5px solid #C9CDD5;border-radius:14px;padding:6px 6px 6px 14px;background:#fff}
.inputrow:focus-within,.text:focus{border-color:var(--accent);outline:none}
.inputrow input{flex:1;min-width:0;border:0;outline:0;font:inherit;font-size:16px;height:40px;background:transparent;color:#15171C}
.text{height:52px;border:1.5px solid #C9CDD5;border-radius:14px;padding:0 14px;font:inherit;font-size:16px;color:#15171C;width:100%}
.chip{height:44px;padding:0 16px;border-radius:10px;border:0;background:#EEF1FD;color:#1A3DB3;font:inherit;font-weight:600;font-size:15px;cursor:pointer;flex:none}
.seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#F0F2F5;border-radius:14px;padding:4px;border:0;margin:0}

.seg input{position:absolute;opacity:0;pointer-events:none}
.seg span{display:flex;align-items:center;justify-content:center;height:44px;border-radius:10px;font-weight:600;font-size:15px;color:#4F5562;cursor:pointer}
.seg input:checked+span{background:#fff;color:#15171C;font-weight:700;box-shadow:0 1px 3px rgba(20,23,28,.12)}
.seg input:focus-visible+span{outline:2px solid var(--accent)}
.btn{height:56px;border-radius:16px;border:0;background:var(--accent);color:#fff;font:inherit;font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;text-decoration:none;width:100%}
.btn:hover{color:#fff;filter:brightness(.95)}
.btn[disabled]{opacity:.6;cursor:wait}
.btn2{min-height:52px;border-radius:14px;border:1.5px solid #C9CDD5;display:flex;align-items:center;justify-content:center;text-decoration:none;font-weight:600;color:#15171C;background:#fff;padding:0 16px;text-align:center}
.error{margin:0;color:#B42318;font-size:14px;font-weight:500}
.steps{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.steps li{background:#fff;border:1px solid #E4E6EB;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600;line-height:1.3}
.steps b{color:#1A3DB3;font-size:13px}
.foot{margin:auto 0 0;font-size:13px;color:#5B6170;text-align:center}
.ok{display:flex;align-items:center;gap:12px}
.ok i{width:40px;height:40px;border-radius:20px;background:#DCF3E8;display:flex;align-items:center;justify-content:center;flex:none}
.ok h1{font-size:26px}
.bubblebox{background:#fff;border:1px solid #E4E6EB;border-radius:20px;padding:18px 16px;display:flex;justify-content:flex-end}
.bubble{width:260px;max-width:100%;border-radius:18px;overflow:hidden;background:#E9E9EB}
.thumb{position:relative;background:#1E2129 center/cover no-repeat;display:flex;align-items:center;justify-content:center}
.bubble .thumb{height:170px}
.dot{width:54px;height:54px;border-radius:27px;background:rgba(255,255,255,.94);display:flex;align-items:center;justify-content:center}
.dur{position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.72);color:#fff;font-size:12px;font-weight:600;padding:3px 7px;border-radius:6px}
.bubble .meta{padding:10px 12px 12px;display:flex;flex-direction:column;gap:2px}
.bubble .meta b{font-size:14px;font-weight:600}
.bubble .meta span{font-size:13px;color:#5B6170}
.note{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #E4E6EB;border-radius:14px;padding:14px 16px;color:#2E323B;font-size:15px}
.viewer{background:#fff}
.viewer .top{border-bottom:1px solid #EEF0F3;padding:16px 20px}
.viewer .logo{width:28px;height:28px;border-radius:8px}
.viewer .brand{font-size:16px}
.viewer main{padding:22px 20px 28px;gap:18px}
.viewer h1{font-size:28px;line-height:1.15;letter-spacing:-.4px}
.player{width:100%;border:0;padding:0;border-radius:22px;aspect-ratio:4/5;max-height:70vh;flex-direction:column;gap:14px;font:inherit;cursor:pointer;overflow:hidden}
.player .dot{width:96px;height:96px;border-radius:48px}
.player .tap{color:#fff;font-size:18px;font-weight:600;text-shadow:0 1px 6px rgba(0,0,0,.5)}
.player .dur{right:14px;bottom:14px;font-size:13px;padding:4px 8px}
.player.shade::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.25)}
.player>*{position:relative}
.player>.dur{position:absolute}
.embed{width:100%;min-height:420px;display:flex;justify-content:center}
.embed iframe{width:100%;border:0;border-radius:16px;min-height:640px}
.who{display:flex;align-items:center;gap:12px}
.who img,.who .av{width:44px;height:44px;border-radius:22px;background:#E4E6EB;flex:none}
.who div{display:flex;flex-direction:column;gap:2px}
.who b{font-size:16px}
.who span{font-size:14px;color:#5B6170}
.caption{margin:0;font-size:19px;line-height:1.45;color:#22252C;white-space:pre-line;overflow-wrap:anywhere}
.expires{margin:0;display:flex;align-items:center;gap:8px;font-size:15px;color:#4F5562}
.sponsor{border:1px solid #E4E6EB;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;background:#FAFBFC;text-decoration:none;color:inherit}
.sponsor img{width:44px;height:44px;border-radius:10px;object-fit:cover}
.sponsor small{display:block;font-size:12px;font-weight:600;color:#5B6170;letter-spacing:.3px}
.sponsor b{font-size:15px;font-weight:600}
.center{align-items:center;text-align:center;justify-content:center}
[hidden]{display:none!important}
@media (max-width:360px){h1{font-size:28px}.steps{grid-template-columns:1fr}}
`;

function layout({ title, head = '', body, accent, viewer = false }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
${head}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${accent}"/><path d="M12 9v14l11-7z" fill="#fff"/></svg>`)}">
<style>:root{--accent:${esc(accent)}}${CSS}</style>
</head>
<body${viewer ? ' class="viewer"' : ''}>
<div class="wrap">
<header class="top"><a href="/"><span class="logo">${ICON_PLAY}</span><span class="brand">Just the Clip</span></a></header>
${body}
</div>
</body>
</html>`;
}

export function homePage({ accent }) {
  const body = `
<main>
  <section id="make" style="display:flex;flex-direction:column;gap:22px">
    <div style="display:flex;flex-direction:column;gap:10px">
      <h1>Share a great video with anyone.</h1>
      <p class="lede">Paste a link from X or Instagram. They tap once and it plays — no app, no account.</p>
    </div>
    <form id="form" class="card" novalidate>
      <div class="field">
        <label for="link">Video link</label>
        <div class="inputrow">
          <input id="link" name="link" type="url" inputmode="url" autocomplete="off" placeholder="Paste an X or Instagram link" required>
          <button type="button" class="chip" id="paste">Paste</button>
        </div>
      </div>
      <div class="field">
        <label for="name">Your name <span class="muted">(optional)</span></label>
        <input id="name" name="name" class="text" type="text" maxlength="30" autocomplete="given-name" placeholder="e.g. Wade">
        <span class="hint" id="namehint">They'll see “Someone sent you a video.”</span>
      </div>
      <fieldset style="border:0;margin:0;padding:0;min-width:0">
        <legend class="label" style="padding:0;margin-bottom:8px">Disappears after</legend>
        <div class="seg">
          <label><input type="radio" name="hours" value="24"><span>24 hours</span></label>
          <label><input type="radio" name="hours" value="48" checked><span>48 hours</span></label>
        </div>
      </fieldset>
      <p class="error" id="error" role="alert" hidden></p>
      <button class="btn" id="go" type="submit">Make my clip ${ICON_ARROW}</button>
    </form>
    <section aria-labelledby="how" style="display:flex;flex-direction:column;gap:12px">
      <h2 id="how" class="label" style="margin:0;color:#4F5562">How it works</h2>
      <ol class="steps">
        <li><b>1</b>Paste the link</li>
        <li><b>2</b>Text it to anyone</li>
        <li><b>3</b>They tap and watch</li>
      </ol>
    </section>
  </section>

  <section id="done" hidden style="display:flex;flex-direction:column;gap:20px">
    <div class="ok"><i>${ICON_CHECK}</i><h1 tabindex="-1" id="donetitle">Your clip is ready</h1></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <h2 class="label" style="margin:0;color:#4F5562">How it looks in a text</h2>
      <div class="bubblebox">
        <div class="bubble">
          <div class="thumb" id="pthumb"><span class="dot"><svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 2.8v10.4l8.2-5.2z" fill="#15171C"/></svg></span><span class="dur" id="pdur" hidden></span></div>
          <div class="meta"><b id="ptitle"></b><span id="phost"></span></div>
        </div>
      </div>
    </div>
    <div class="field">
      <label for="out">Your link</label>
      <div class="inputrow">
        <input id="out" type="text" readonly>
        <button type="button" class="chip" id="copy" style="min-width:84px">Copy</button>
      </div>
    </div>
    <button type="button" class="btn" id="share">${ICON_SHARE} Send by text or email</button>
    <div class="note">${ICON_CLOCK}<span id="expnote"></span></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a class="btn2" id="peek" href="#" target="_blank" rel="noopener" style="flex:1">See what they'll see</a>
      <button type="button" class="btn2" id="again" style="flex:1;font:inherit;font-weight:600;cursor:pointer">Make another</button>
    </div>
  </section>

  <p class="foot">Nothing is stored. Clips disappear on their own.</p>
</main>
<script>
(() => {
  const $ = (id) => document.getElementById(id);
  const form = $('form'), err = $('error'), go = $('go');
  const showErr = (m) => { err.textContent = m; err.hidden = !m; };
  $('name').addEventListener('input', (e) => {
    const n = e.target.value.trim();
    $('namehint').textContent = 'They\\u2019ll see \\u201c' + (n || 'Someone') + ' sent you a video.\\u201d';
  });
  $('paste').addEventListener('click', async () => {
    try { $('link').value = (await navigator.clipboard.readText()).trim(); showErr(''); }
    catch { $('link').focus(); showErr('Press and hold in the box, then choose Paste.'); }
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showErr('');
    const link = $('link').value.trim();
    if (!link) { showErr('Paste a link from X or Instagram first.'); $('link').focus(); return; }
    go.disabled = true; go.firstChild.textContent = 'Making your clip… ';
    try {
      const res = await fetch('/api/make', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ link, name: $('name').value.trim(), hours: Number(form.hours.value) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      $('out').value = data.url;
      $('peek').href = data.url;
      $('ptitle').textContent = data.title;
      $('phost').textContent = location.host;
      $('pthumb').style.backgroundImage = data.thumb ? 'url(' + JSON.stringify(data.thumb) + ')' : '';
      $('pdur').textContent = data.duration || ''; $('pdur').hidden = !data.duration;
      $('expnote').innerHTML = 'Disappears in <strong>' + data.hours + ' hours</strong>';
      $('make').hidden = true; $('done').hidden = false;
      window.scrollTo(0, 0); $('donetitle').focus();
      window.__clip = data;
    } catch (ex) {
      showErr(ex.message);
    } finally {
      go.disabled = false; go.firstChild.textContent = 'Make my clip ';
    }
  });
  const copy = async () => {
    const v = $('out').value;
    try { await navigator.clipboard.writeText(v); } catch { $('out').select(); document.execCommand('copy'); }
    $('copy').textContent = 'Copied';
    setTimeout(() => { $('copy').textContent = 'Copy'; }, 2000);
  };
  $('copy').addEventListener('click', copy);
  $('share').addEventListener('click', async () => {
    const d = window.__clip;
    if (navigator.share) {
      try { await navigator.share({ title: d.title, url: d.url }); } catch {}
    } else { copy(); }
  });
  $('again').addEventListener('click', () => {
    $('link').value = ''; $('done').hidden = true; $('make').hidden = false; $('link').focus();
  });
})();
</script>`;
  return layout({
    title: 'Just the Clip — share X and Instagram videos with anyone',
    head: `<meta name="description" content="Share videos from X or Instagram with people who don't use them. One tap to play, no app, no account.">
<meta property="og:title" content="Just the Clip">
<meta property="og:description" content="Share X and Instagram videos with anyone. One tap to play, no app, no account.">`,
    body,
    accent,
  });
}

function hoursLeft(exp) {
  const h = Math.floor((exp * 1000 - Date.now()) / 3600000);
  if (h < 1) return 'This video disappears in less than an hour.';
  return `This video disappears in ${h} hour${h === 1 ? '' : 's'}.`;
}

export function viewerPage({ clip, details, url, accent, sponsor }) {
  const sender = clip.name ? `${clip.name} sent you a video` : 'Someone sent you a video';
  const d = details.found ? details : {};
  const where = clip.platform === 'x' ? 'X' : 'Instagram';
  const postUrl = clip.platform === 'x'
    ? `https://x.com/i/status/${clip.id}`
    : `https://www.instagram.com/p/${clip.id}/`;
  const descBits = [];
  if (d.caption) descBits.push(d.caption.length > 140 ? d.caption.slice(0, 137) + '…' : d.caption);
  descBits.push(d.handle ? `Tap to watch · @${d.handle} on ${where}` : `Tap to watch · from ${where}`);
  const desc = descBits.join(' — ');

  const head = `<meta name="robots" content="noindex">
<meta property="og:site_name" content="Just the Clip">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(sender)}">
<meta property="og:description" content="${esc(desc)}">
${d.thumb ? `<meta property="og:image" content="${esc(d.thumb)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${esc(d.thumb)}">` : '<meta name="twitter:card" content="summary">'}
<meta name="twitter:title" content="${esc(sender)}">
<meta name="twitter:description" content="${esc(desc)}">`;

  const who = d.author || d.handle
    ? `<div class="who">${d.avatar ? `<img src="${esc(d.avatar)}" alt="">` : '<span class="av"></span>'}<div><b>${esc(d.author || '@' + d.handle)}</b><span>${d.handle ? '@' + esc(d.handle) + ' ' : ''}on ${where}</span></div></div>`
    : '';

  const sponsorBlock = sponsor
    ? `<a class="sponsor" href="${esc(sponsor.url || '#')}" rel="sponsored noopener" target="_blank">${sponsor.logo ? `<img src="${esc(sponsor.logo)}" alt="">` : ''}<span><small>BROUGHT TO YOU BY</small><b>${esc(sponsor.name)}${sponsor.line ? ' — ' + esc(sponsor.line) : ''}</b></span></a>`
    : '';

  const body = `
<main>
  <h1>${esc(sender)}</h1>
  <div id="stage">
    <button type="button" id="play" class="thumb player${d.thumb ? ' shade' : ''}" aria-label="Play video"${d.thumb ? ` style="background-image:url('${esc(d.thumb)}')"` : ''}>
      <span class="dot">${BIG_PLAY}</span>
      <span class="tap">Tap to play</span>
      ${d.duration ? `<span class="dur">${esc(d.duration)}</span>` : ''}
    </button>
  </div>
  ${who}
  ${d.caption ? `<p class="caption">${esc(d.caption)}</p>` : ''}
  <p class="expires">${ICON_CLOCK}${esc(hoursLeft(clip.exp))}</p>
  ${sponsorBlock}
  <a class="btn2" href="/" style="margin-top:auto">Send your own video to someone</a>
  <p class="foot" style="margin:0">No account needed · Nothing to install · <a href="${esc(postUrl)}" rel="noopener" target="_blank">Original post</a></p>
</main>
<script>
(() => {
  const platform = ${JSON.stringify(clip.platform)}, id = ${JSON.stringify(clip.id)};
  const stage = document.getElementById('stage');
  document.getElementById('play').addEventListener('click', () => {
    if (platform === 'x') {
      stage.innerHTML = '<div class="embed"><blockquote class="twitter-video" data-status="hidden" data-dnt="true" data-theme="light"><a href="https://twitter.com/i/status/' + id + '">Loading video…</a></blockquote></div>';
      const s = document.createElement('script');
      s.src = 'https://platform.twitter.com/widgets.js'; s.async = true; s.charset = 'utf-8';
      document.body.appendChild(s);
    } else {
      stage.innerHTML = '<div class="embed"><iframe src="https://www.instagram.com/p/' + id + '/embed" title="Instagram video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="eager"></iframe></div>';
    }
  });
})();
</script>`;
  return layout({ title: sender + ' · Just the Clip', head, body, accent, viewer: true });
}

export function messagePage({ title, text, accent, status }) {
  const body = `
<main class="center">
  <h1>${esc(title)}</h1>
  <p class="lede">${esc(text)}</p>
  <a class="btn" href="/" style="max-width:340px">Send a video to someone</a>
</main>`;
  return layout({ title: title + ' · Just the Clip', head: '<meta name="robots" content="noindex">', body, accent, viewer: true });
}
