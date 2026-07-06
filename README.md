# ZeroToStore — Shopify Course Funnel Site

A static marketing funnel for the Shopify eCommerce course: lead magnet email capture, three free interactive tools, and a waitlist/pricing section. Plain HTML/CSS/JS — no build step, no backend.

## Pages

| Page | What it does |
|---|---|
| `index.html` | The funnel: hero → problems → free PDF capture → tools → curriculum → social proof → waitlist → FAQ → final CTA |
| `tools/name-generator.html` | Store name generator with domain-check links |
| `tools/niche-picker.html` | 7-question quiz, scores 15 niches, shows top 3 |
| `tools/marketing-toolkit.html` | Ad copy builder + product descriptions + profit calculator |

## 1. Deploy on GitHub Pages

1. Push this folder to a GitHub repository (`main` branch).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, pick branch **`main`** and folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute. Your site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

All links are relative, so the site works from the subpath without any changes.

## 2. Email capture (Formspree)

**Already configured.** The Formspree form ID (`xqevjzyz`) is set in [js/main.js](js/main.js) — every form on the site (PDF capture, waitlist, tool pages) posts to it. To switch to a different form later, change the `FORMSPREE_FORM_ID` constant at the top of that file.

Each submission includes a hidden `source` field so you can tell them apart in the Formspree dashboard:
- `source: pdf` — wants the lead magnet
- `source: waitlist` — wants course enrollment

Formspree's free tier includes 50 submissions/month; upgrade or swap the provider if you outgrow it.

## 3. The lead magnet PDF

The download links point at `assets/The AI Advantage.pdf`. If you replace the guide, **keep the same filename** — otherwise update the links in `index.html` and the three tool pages (search for `The%20AI%20Advantage.pdf`).

## 4. Still placeholder — replace before launch

| Placeholder | Where | Replace with |
|---|---|---|
| Testimonials | `index.html`, marked `<!-- PLACEHOLDER: test testimonials -->` | real student quotes |
| Stats bar numbers | `index.html`, marked `<!-- PLACEHOLDER: real stats -->` | real numbers (or remove the bar) |
| Contact email | footer of every page, marked `<!-- CONTACT EMAIL -->` | a "Questions? email" line once there's an address |
| `<!-- ANALYTICS HERE -->` | `<head>` of every page | Google Analytics / Meta Pixel snippet |

### When the course price is decided

In `index.html`, the pricing section (`#pricing`) has a comment marked `CHECKOUT SWAP` — replace the waitlist form with a buy button pointing at Gumroad / Lemon Squeezy / your checkout, and swap the "Opening soon" badge for the price.

## Run locally

```bash
python3 -m http.server
# then open http://localhost:8000
```

Any static server works. Don't open the files via `file://` — the clipboard buttons and form fetch need an HTTP origin to behave like production.

## Editing notes

- **Niches**: edit the `NICHES` array at the top of [js/niche-picker.js](js/niche-picker.js) — the quiz logic reads everything from it.
- **Name word banks**: edit `BANKS` in [js/name-generator.js](js/name-generator.js).
- **Ad/description templates**: edit `AD_TEMPLATES` and the description strings in [js/marketing-tools.js](js/marketing-tools.js).
- **Colors/fonts**: design tokens live at the top of [css/style.css](css/style.css) (`:root`). The primary blue (`#0064fe`) is sampled from the logo.
- **Logo files**: `assets/logo.png` is the original; `assets/logo-wordmark.png` (nav) and `assets/favicon.png` are derived from it with the transparent margins trimmed. If the logo changes, regenerate those two.
- Copy is in English; no text is baked into images, so localizing to Serbian later is a straight text edit.
