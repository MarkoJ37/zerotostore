# [COURSE NAME] — Shopify Course Funnel Site

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

## 2. Set up email capture (Formspree — free)

Signups currently go nowhere until you do this (takes ~3 minutes):

1. Create a free account at [formspree.io](https://formspree.io).
2. Click **New form**, name it (e.g. "Course funnel"), and copy the form's ID — it's the last part of the endpoint URL: `https://formspree.io/f/`**`xdoqwxyz`**.
3. Open [js/main.js](js/main.js) and replace the placeholder on the first constant:
   ```js
   const FORMSPREE_FORM_ID = "FORM_ID"; // <-- paste your ID here, e.g. "xdoqwxyz"
   ```
4. That's it — every form on the site (PDF capture, waitlist, tool pages) uses this one ID.

Each submission includes a hidden `source` field so you can tell them apart in the Formspree dashboard:
- `source: pdf` — wants the lead magnet
- `source: waitlist` — wants course enrollment

Formspree's free tier includes 50 submissions/month; upgrade or swap the provider if you outgrow it.

## 3. Add the real lead magnet PDF

Replace the placeholder at [assets/lead-magnet.pdf](assets/lead-magnet.pdf) with the real guide — **keep the same filename** and every download link keeps working.

## 4. Find-and-replace checklist before launch

Search the whole project for these and replace:

| Placeholder | Where | Replace with |
|---|---|---|
| `[COURSE NAME]` | every page (titles, nav, footer) | the real course name |
| `hello@example.com` | footers (marked `<!-- CONTACT EMAIL PLACEHOLDER -->`) | real contact email |
| `FORM_ID` | `js/main.js` | your Formspree form ID |
| Testimonials | `index.html`, marked `<!-- PLACEHOLDER: real testimonials -->` | real student quotes |
| Stats bar numbers | `index.html`, marked `<!-- PLACEHOLDER: real stats -->` | real numbers (or remove the bar) |
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
- **Colors/fonts**: design tokens live at the top of [css/style.css](css/style.css) (`:root`).
- Copy is in English; no text is baked into images, so localizing to Serbian later is a straight text edit.
