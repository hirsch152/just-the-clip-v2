# Just the Clip

Share videos from X or Instagram with people who don't use them. Paste a link, text it to anyone, and they tap once to watch, with no app and no account.

- **Nothing is stored.** Everything a clip needs is inside its link, which is signed so nobody can change it.
- **Links expire** after 24 or 48 hours (the sender picks).
- **Official players.** Videos play through X's and Instagram's own embed players.
- **Real link previews.** Each clip link shows that video's thumbnail when texted (X posts; Instagram is best effort).
- **Sponsor spot** built in, hidden until you turn it on.

Runs on Cloudflare Workers. There's no build step: the whole app is in `src/`.

## Put it live on Cloudflare (one time)

1. Sign in at **dash.cloudflare.com** → **Compute (Workers)** → **Workers & Pages** → **Create** → **Import a repository**.
2. Connect GitHub if asked, pick **just-the-clip-v2**, and click **Next**.
3. Leave the settings as they are (deploy command `npx wrangler deploy`). Click **Deploy**.
4. When it finishes, open the worker → **Settings** → **Variables and Secrets** → **Add**:
   - Type: **Secret**, Name: `LINK_SECRET`, Value: any long random password (e.g. 40 random letters and numbers). Save.
   - This keeps people from editing links. Changing it later breaks links that are already out, so set it once.
5. Optional, your own domain: worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → e.g. `justtheclip.com`.

After that, every change pushed to GitHub goes live automatically.

## Turning on the sponsor spot

In the worker's **Settings → Variables and Secrets**, add plain-text variables:

| Name | Example |
|---|---|
| `SPONSOR_NAME` | Acme Hearing |
| `SPONSOR_LINE` | Free hearing check this month |
| `SPONSOR_URL` | https://example.com |
| `SPONSOR_LOGO` | https://example.com/logo.png (square image) |

Only `SPONSOR_NAME` is required. Delete it to hide the spot again. `ACCENT_COLOR` changes the main color.

## Running it on your own computer (optional)

```
npm install
npm run dev
```

Then open http://localhost:8787. Put `LINK_SECRET=anything` in a file named `.dev.vars` to test signed links.
