# alienation

Bilingual static notebook for Xin Zheng. The public writing name on this site is alienation.

The live site is whatever is on `main`:

https://zx070326-hash.github.io/alienation/

Merging to `main` publishes that URL. Do not merge until the pages have been read and approved. This repository has no Pages preview workflow, and this branch does not deploy itself.

## Preview locally

From the repository root:

```bash
python3 -m http.server 4173
```

- Gateway: http://127.0.0.1:4173/
- Chinese notebook: http://127.0.0.1:4173/zh-index.html
- English notebook: http://127.0.0.1:4173/en-index.html
- Dashboard: http://127.0.0.1:4173/dashboard/

Open the dashboard over `http://localhost` or `https`. A `file://` URL cannot run the passphrase check.

The placeholder passphrase is `change-me`.

## Edit the public notebook

Public pages are hand-written HTML. The dashboard does not fill them. When a fact changes, update both languages:

- `zh-projects.html` and `en-projects.html`
- `zh-reports.html` and `en-reports.html`
- `zh-ideas.html` and `en-ideas.html`
- `zh-about.html` and `en-about.html`
- the status line on `zh-index.html` and `en-index.html`

Keep a claim tied to a link that opens. The copy checked on 10 November 2026 used the ChemRxiv record for ETALON (DOI `10.26434/chemrxiv.15011490/v1`, posted 2 November 2026, not peer reviewed) and the public repositories under `zx070326-hash` and `AIB001`.

`awm-site` is a fork of `Ephemeral6/awm-site`. Its public commits are from the upstream author, so it is not listed as a personal project.

## Edit the dashboard

- `dashboard/data.json` holds the “now” note, projects, and milestones. Array order is the display order. Leave `verified` as `false` on anything that is still a placeholder.
- `dashboard/config.js` holds `passphrase`. Replace `change-me`.
- After changing the passphrase, press Lock once, or clear the `alienation-dashboard` key in localStorage. The old unlock is a hash of the previous string.

The footer link labeled 个人 / Me is the only public pointer. It is not in the header navigation.

## The dashboard is not private

GitHub Free Pages is public. Anyone can open `/dashboard/`, read `dashboard/config.js`, and download `dashboard/data.json`. The passphrase only hides the layout on a browser that has not unlocked it.

`robots.txt` in this repo is served at `/alienation/robots.txt`. Crawlers read `https://zx070326-hash.github.io/robots.txt`, which this repository does not control. The dashboard page also sends `noindex, nofollow`. That is a request to crawlers, not access control.

Do not put secrets, unpublished manuscripts, or private repository names in `data.json`. A real private notebook needs a private host later.
