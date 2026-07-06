# CLAUDE.md — Shopify eCommerce Course Funnel Site

## What this is
A single-purpose marketing funnel website for a Shopify eCommerce course. The site's job is to: (1) capture emails via a free PDF lead magnet, (2) build trust and engagement with free interactive tools, and (3) convert visitors into course buyers/waitlist signups.

Hosted on **GitHub Pages** (static only — no backend, no server-side code, no secrets in the repo).

## Open decisions (confirm with Marko before diverging)
- **Language: English** (assumed — partners involved). Structure copy so Serbian localization is easy later (no text baked into images/SVGs).
- **Course price/checkout:** not decided yet. Build the pricing section with a placeholder CTA that can point to Gumroad/Lemon Squeezy/waitlist form later. Default: "Join the waitlist" (email capture).
- Placeholder brand name: use `[COURSE NAME]` consistently so find-and-replace works.

## Tech stack — keep it simple
- **Vanilla HTML/CSS/JS. No frameworks, no build step.** Must work by pushing to a repo and enabling GitHub Pages.
- One `index.html` as the funnel page. Tools live on separate pages (`/tools/name-generator.html`, etc.) linked from the main page — this gives shareable URLs and keeps index.html lean.
- Shared `css/style.css` and `js/` folder. Keep JS per-tool in separate files.
- Fully responsive (mobile-first — partners will share links via chat apps).
- No cookies, no tracking beyond a placeholder comment for Google Analytics / Meta Pixel (`<!-- ANALYTICS HERE -->` in the head).

## Repo structure
```
/
├── index.html            # the funnel
├── css/style.css
├── js/main.js            # nav, scroll animations, form handling
├── js/name-generator.js
├── js/niche-picker.js
├── js/marketing-tools.js
├── tools/
│   ├── name-generator.html
│   ├── niche-picker.html
│   └── marketing-toolkit.html
├── assets/               # images, favicon, PDF goes here later
│   └── lead-magnet.pdf   # placeholder — Marko will add the real PDF
└── README.md             # deploy instructions for partners
```

## Funnel structure (index.html, top to bottom)

1. **Hero** — clear promise headline about building a profitable Shopify store, subline, primary CTA scrolling to the lead magnet. No vague "unlock your potential" copy — concrete outcome language.
2. **Problem → promise** — short section naming the 3 real reasons beginner stores fail (niche, traffic, trust) and how the course addresses each. Keep it tight, 3 cards max.
3. **Lead magnet (email capture #1)** — free PDF: *"How to Use AI to Your Advantage in Online Sales"*. Email form + "Send me the PDF" button. See *Email capture* below.
4. **Free tools showcase** — 3 cards linking to the tool pages (Name Generator, Niche Picker, Marketing Toolkit). Frame as "a taste of what's inside the course."
5. **What's in the course** — module/curriculum overview, 5–7 modules with one-line descriptions. Placeholder content is fine but make it realistic (store setup, niche & product research, AI workflows, ads & marketing, conversion optimization, scaling).
6. **Social proof** — testimonial section with 3 placeholder testimonials clearly marked `<!-- PLACEHOLDER: real testimonials -->`. Include a stats bar (students, stores launched, etc.) with placeholder numbers.
7. **Pricing / offer** — single offer card. Default CTA: "Join the waitlist" (email capture #2, same mechanism). Structure so a price + buy button can be swapped in.
8. **FAQ** — 5–6 questions, accordion. Cover: who it's for, time needed, whether Shopify costs extra, refunds, AI tool costs.
9. **Final CTA + footer** — repeat the lead magnet form. Footer: minimal, contact email placeholder, no fake legal pages.

## Email capture (critical — static site constraint)
- Use **Formspree** (free tier) as the default: plain HTML `<form action="https://formspree.io/f/FORM_ID" method="POST">`. Put `FORM_ID` as an obvious placeholder constant at the top of `js/main.js` / in the form, and document in README how to create the form and paste the ID.
- On submit: show an inline success state ("Check your inbox") via JS fetch + also link the PDF directly (`assets/lead-magnet.pdf`) on the success message — instant gratification, no email automation needed for v1.
- Both capture points (lead magnet + waitlist) use the same form ID but include a hidden `source` field (`pdf` / `waitlist`) so signups are distinguishable.

## The three tools (all client-side JS, no APIs, no keys)

### 1. Store Name Generator (`tools/name-generator.html`)
- Input: niche/keyword + optional style toggle (playful / premium / minimal).
- Logic: word banks (prefixes, suffixes, evocative nouns) + patterns (compound, portmanteau, "The ___ Co.", keyword+modifier). Generate 10 names per click, regenerate button.
- Each result gets: copy button + a "check domain" link (`https://www.namecheap.com/domains/registration/results/?domain={name}.com` — opens in new tab, no API needed).

### 2. Niche Picker (`tools/niche-picker.html`)
- 6–8 question quiz (budget, interests, risk tolerance, content comfort, margin vs volume preference, seasonality tolerance).
- Scores against a built-in dataset of ~15 niches (each with: demand level, competition, avg margin, difficulty, one-line "why it works"). Show top 3 matches with a simple score bar and reasoning.
- Data lives as a JS object — easy to edit niches without touching logic.

### 3. Marketing Toolkit (`tools/marketing-toolkit.html`)
Three mini-tools on one page, tabbed:
- **Ad copy builder**: user fills product, audience, main benefit, offer → generates 3 ad copy variants from templates (hook / body / CTA structure). Template-based fill-in, not AI — make templates good enough that output feels tailored.
- **Product description generator**: same approach, outputs a short + long description.
- **Profit margin calculator**: product cost, shipping, ad cost per sale, price → margin %, break-even ROAS, profit per sale. This one is pure math and genuinely useful — make it the polished centerpiece of the page.

Every tool page ends with the lead magnet form ("Want the full AI playbook? Grab the free PDF").

## Design direction
Eye-catching but restrained — one bold element, everything else disciplined.

- **Make deliberate palette/typography choices grounded in the eCommerce/commerce subject** — avoid the generic AI-design defaults (cream background + serif + terracotta accent; near-black + acid green; newspaper hairlines). Pick something that reads modern-commercial: confident, energetic, trustworthy.
- One characterful display font for headlines (Google Fonts), one clean body font. Strong type scale.
- **One signature element** — e.g. an animated hero visual, a distinctive card treatment, or a scroll-triggered stat reveal. Just one. Everything else stays quiet.
- Micro-interactions on buttons/cards (hover lift, subtle transitions). Respect `prefers-reduced-motion`.
- Tools should feel like real products: instant feedback, copy buttons, satisfying result reveal.
- Accessible: visible focus states, semantic HTML, sufficient contrast.

## README.md must include
1. How to enable GitHub Pages on the repo (Settings → Pages → main branch).
2. How to set up Formspree and where to paste the form ID.
3. Where to drop the real PDF (`assets/lead-magnet.pdf`).
4. Find-and-replace list: `[COURSE NAME]`, placeholder testimonials, placeholder stats, contact email, analytics snippet.

## Working style
- Build iteratively: skeleton + funnel page first, then tools one by one. Verify each tool works before moving on.
- Test everything with `python3 -m http.server` locally — everything must work from a plain static server with relative paths (GitHub Pages serves from a subpath: use relative links, never root-absolute `/css/...`).
- No placeholder lorem ipsum — write real, specific copy everywhere except the clearly marked testimonial/stats placeholders.
- Commit in logical chunks with clear messages.
