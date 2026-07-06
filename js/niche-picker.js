/* ==========================================================================
   Niche Picker Quiz — scores answers against a built-in niche dataset.
   To add/edit niches, only touch the NICHES array below — the quiz logic
   reads everything from it.
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------------------------------------------
     Dataset. Attribute scale is 1–3:
       budget      — startup budget the niche realistically needs (1 low … 3 high)
       content     — how much content creation it takes to market (1 little … 3 lots)
       risk        — competitiveness/volatility (1 safe … 3 risky)
       marginStyle — 1 = volume play (many cheap sales) … 3 = margin play (few, high-profit)
       seasonality — 1 = evergreen … 3 = strongly seasonal
       difficulty  — 1 = beginner-friendly … 3 = advanced
       categories  — interest buckets the niche belongs to
     Display fields: demand, competition, margin, level, why.
     -------------------------------------------------------------------- */
  const NICHES = [
    {
      name: "Pet Accessories", icon: "🐾",
      budget: 2, content: 2, risk: 2, marginStyle: 2, seasonality: 1, difficulty: 1,
      categories: ["lifestyle", "practical"],
      demand: "High", competition: "High", margin: "40–60%", level: "Beginner-friendly",
      why: "Pet owners buy emotionally and repeatedly — a store with personality can out-brand the generic competition.",
    },
    {
      name: "Home Organization", icon: "🗄️",
      budget: 2, content: 2, risk: 1, marginStyle: 1, seasonality: 1, difficulty: 1,
      categories: ["practical", "home"],
      demand: "High", competition: "Medium", margin: "35–55%", level: "Beginner-friendly",
      why: "Evergreen demand fueled by decluttering trends; products are cheap to ship and easy to demo in short videos.",
    },
    {
      name: "Eco-Friendly Everyday Products", icon: "🌱",
      budget: 2, content: 3, risk: 2, marginStyle: 3, seasonality: 1, difficulty: 2,
      categories: ["lifestyle", "wellness"],
      demand: "High", competition: "Medium", margin: "45–65%", level: "Moderate",
      why: "Values-driven buyers pay a premium and stay loyal — but the brand story has to be genuine and well told.",
    },
    {
      name: "Home Fitness & Recovery", icon: "🏋️",
      budget: 2, content: 3, risk: 2, marginStyle: 2, seasonality: 2, difficulty: 2,
      categories: ["wellness", "lifestyle"],
      demand: "High", competition: "High", margin: "40–60%", level: "Moderate",
      why: "Huge market with strong January/summer spikes; content marketing (form tips, routines) builds trust fast.",
    },
    {
      name: "Coffee & Brewing Gear", icon: "☕",
      budget: 2, content: 2, risk: 1, marginStyle: 3, seasonality: 1, difficulty: 2,
      categories: ["lifestyle", "home"],
      demand: "Medium", competition: "Medium", margin: "50–70%", level: "Moderate",
      why: "Enthusiast buyers upgrade constantly and love niche brands — high margins on accessories and consumables.",
    },
    {
      name: "Baby & Toddler Essentials", icon: "🍼",
      budget: 3, content: 2, risk: 2, marginStyle: 2, seasonality: 1, difficulty: 2,
      categories: ["practical", "lifestyle"],
      demand: "High", competition: "High", margin: "35–55%", level: "Moderate",
      why: "Parents research hard but spend freely on quality and safety — trust signals matter more than price.",
    },
    {
      name: "Phone & Desk Accessories", icon: "📱",
      budget: 1, content: 1, risk: 3, marginStyle: 1, seasonality: 1, difficulty: 1,
      categories: ["tech", "practical"],
      demand: "High", competition: "High", margin: "25–45%", level: "Beginner-friendly",
      why: "Cheap to source and test — a good entry niche to learn the ropes, but you'll need volume and fast trend-spotting.",
    },
    {
      name: "Home Office & Productivity", icon: "💻",
      budget: 2, content: 2, risk: 1, marginStyle: 2, seasonality: 1, difficulty: 1,
      categories: ["tech", "practical", "home"],
      demand: "High", competition: "Medium", margin: "40–60%", level: "Beginner-friendly",
      why: "Remote work made this evergreen; buyers are adults with budgets who value quality over lowest price.",
    },
    {
      name: "Skincare Tools & Beauty Accessories", icon: "✨",
      budget: 2, content: 3, risk: 2, marginStyle: 3, seasonality: 1, difficulty: 2,
      categories: ["wellness", "lifestyle"],
      demand: "High", competition: "High", margin: "55–75%", level: "Moderate",
      why: "Excellent margins and made for short-form video — wins go to stores that master content, not ads alone.",
    },
    {
      name: "Outdoor & Camping Gear", icon: "🏕️",
      budget: 3, content: 2, risk: 2, marginStyle: 3, seasonality: 3, difficulty: 2,
      categories: ["lifestyle", "practical"],
      demand: "Medium", competition: "Medium", margin: "40–60%", level: "Moderate",
      why: "Passionate community, higher order values, and gift-season spikes — plan inventory around the seasons.",
    },
    {
      name: "Kitchen Gadgets", icon: "🍳",
      budget: 1, content: 2, risk: 2, marginStyle: 1, seasonality: 2, difficulty: 1,
      categories: ["home", "practical"],
      demand: "High", competition: "High", margin: "30–50%", level: "Beginner-friendly",
      why: "Demo-friendly products that sell themselves on video; low price points mean volume is the game.",
    },
    {
      name: "Jewelry & Personal Accessories", icon: "💍",
      budget: 2, content: 3, risk: 2, marginStyle: 3, seasonality: 2, difficulty: 2,
      categories: ["lifestyle", "creative"],
      demand: "High", competition: "High", margin: "60–80%", level: "Moderate",
      why: "Some of the best margins in eCommerce; gift seasons drive spikes and branding is everything.",
    },
    {
      name: "Gaming Accessories", icon: "🎮",
      budget: 2, content: 2, risk: 2, marginStyle: 2, seasonality: 2, difficulty: 2,
      categories: ["tech", "lifestyle"],
      demand: "High", competition: "Medium", margin: "35–55%", level: "Moderate",
      why: "A community that loves niche brands and buys upgrades often — authenticity beats polish here.",
    },
    {
      name: "Plants & Indoor Gardening", icon: "🪴",
      budget: 1, content: 2, risk: 1, marginStyle: 2, seasonality: 2, difficulty: 1,
      categories: ["home", "creative", "wellness"],
      demand: "Medium", competition: "Low", margin: "45–65%", level: "Beginner-friendly",
      why: "Lower competition than most lifestyle niches, with an engaged hobbyist audience and natural repeat purchases.",
    },
    {
      name: "Car Accessories & Detailing", icon: "🚗",
      budget: 2, content: 2, risk: 1, marginStyle: 2, seasonality: 1, difficulty: 2,
      categories: ["practical", "tech"],
      demand: "Medium", competition: "Medium", margin: "40–60%", level: "Moderate",
      why: "Underrated niche with loyal enthusiasts; satisfying before/after content practically writes your ads.",
    },
    {
      name: "Print-on-Demand Apparel", icon: "👕",
      budget: 1, content: 3, risk: 2, marginStyle: 1, seasonality: 2, difficulty: 1,
      categories: ["creative", "lifestyle"],
      demand: "High", competition: "High", margin: "20–40%", level: "Beginner-friendly",
      why: "Zero inventory risk — perfect for creatives testing designs, though margins reward volume and strong niching.",
    },
  ];

  /* --------------------------------------------------------------------
     Questions. Each answer sets a value for one scoring dimension
     (or `category` for the interest question).
     -------------------------------------------------------------------- */
  const QUESTIONS = [
    {
      key: "budget",
      title: "How much can you invest to get started (products, store, first ads)?",
      options: [
        { label: "Under $250 — keeping it lean", value: 1 },
        { label: "$250–$1,000 — a modest budget", value: 2 },
        { label: "Over $1,000 — ready to invest properly", value: 3 },
      ],
    },
    {
      key: "category",
      title: "Which area sounds most like you?",
      options: [
        { label: "Practical & useful — I like products that solve problems", value: "practical" },
        { label: "Home & living — spaces, kitchens, cozy things", value: "home" },
        { label: "Health & wellness — fitness, self-care, better habits", value: "wellness" },
        { label: "Tech & gadgets — gear, setups, new toys", value: "tech" },
        { label: "Creative & style — design, fashion, expression", value: "creative" },
        { label: "Lifestyle & passions — pets, hobbies, communities", value: "lifestyle" },
      ],
    },
    {
      key: "risk",
      title: "How do you feel about competition and risk?",
      options: [
        { label: "Play it safe — steady niche, even if growth is slower", value: 1 },
        { label: "Balanced — some competition is fine if demand is real", value: 2 },
        { label: "Bring it on — big markets, big swings, big upside", value: 3 },
      ],
    },
    {
      key: "content",
      title: "How comfortable are you creating content (videos, photos, posts)?",
      options: [
        { label: "Not my thing — I'd rather not be on camera", value: 1 },
        { label: "I can do some — product shots and simple posts", value: 2 },
        { label: "Love it — I'll happily make videos every week", value: 3 },
      ],
    },
    {
      key: "marginStyle",
      title: "Which business model appeals more?",
      options: [
        { label: "Volume — lots of affordable products, many small wins", value: 1 },
        { label: "Middle ground — decent margins, steady order flow", value: 2 },
        { label: "Margin — fewer sales, but each one earns real profit", value: 3 },
      ],
    },
    {
      key: "seasonality",
      title: "How do you feel about seasonal ups and downs?",
      options: [
        { label: "I want steady, year-round sales", value: 1 },
        { label: "Some seasonality is fine", value: 2 },
        { label: "Happy to ride big seasonal waves (holidays, summer)", value: 3 },
      ],
    },
    {
      key: "difficulty",
      title: "How much of a challenge do you want for your first store?",
      options: [
        { label: "Easiest possible start — I'm brand new", value: 1 },
        { label: "Moderate — I can handle a learning curve", value: 2 },
        { label: "I have some experience — give me depth", value: 3 },
      ],
    },
  ];

  /* ---------- State & elements ---------- */
  const root = document.getElementById("quiz-root");
  const progressFill = document.getElementById("quiz-progress-fill");
  let step = 0;
  const answers = {};

  renderQuestion();

  /* ---------- Rendering ---------- */

  function renderQuestion() {
    const q = QUESTIONS[step];
    progressFill.style.width = (step / QUESTIONS.length) * 100 + "%";

    root.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "quiz-question";

    const stepLabel = document.createElement("p");
    stepLabel.className = "quiz-step-label";
    stepLabel.textContent = "Question " + (step + 1) + " of " + QUESTIONS.length;

    const title = document.createElement("h2");
    title.textContent = q.title;

    const options = document.createElement("div");
    options.className = "quiz-options";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        answers[q.key] = opt.value;
        step++;
        if (step < QUESTIONS.length) renderQuestion();
        else renderResults();
      });
      options.appendChild(btn);
    });

    wrap.append(stepLabel, title, options);

    if (step > 0) {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "quiz-back";
      back.textContent = "← Back";
      back.addEventListener("click", () => {
        step--;
        renderQuestion();
      });
      wrap.appendChild(back);
    }

    root.appendChild(wrap);
  }

  function renderResults() {
    progressFill.style.width = "100%";

    const scored = NICHES.map((n) => ({ niche: n, score: scoreNiche(n) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    root.innerHTML = "";

    const head = document.createElement("div");
    head.className = "quiz-question";
    head.innerHTML =
      '<p class="quiz-step-label">Your results</p>' +
      "<h2>Your top 3 niche matches</h2>";
    root.appendChild(head);

    scored.forEach((entry, i) => {
      const n = entry.niche;
      const pct = entry.score;
      const card = document.createElement("article");
      card.className = "match-card";
      card.innerHTML =
        '<p class="match-rank">' + ["Best match", "Runner-up", "Also worth a look"][i] + "</p>" +
        '<div class="match-head"><h3>' + n.icon + " " + escapeHtml(n.name) + "</h3>" +
        '<span class="match-score">' + pct + "% match</span></div>" +
        '<div class="score-bar"><div class="score-bar-fill"></div></div>' +
        '<div class="match-meta">' +
        '<span class="match-tag">Demand: ' + n.demand + "</span>" +
        '<span class="match-tag">Competition: ' + n.competition + "</span>" +
        '<span class="match-tag">Avg. margin: ' + n.margin + "</span>" +
        '<span class="match-tag">' + n.level + "</span>" +
        "</div>" +
        '<p class="match-why">' + escapeHtml(n.why) + "</p>";
      root.appendChild(card);

      // Animate the score bar after insertion
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.querySelector(".score-bar-fill").style.width = pct + "%";
        });
      });
    });

    const retake = document.createElement("button");
    retake.type = "button";
    retake.className = "btn btn-ghost";
    retake.style.marginTop = "1rem";
    retake.textContent = "Retake the quiz";
    retake.addEventListener("click", () => {
      step = 0;
      for (const k in answers) delete answers[k];
      renderQuestion();
    });
    root.appendChild(retake);
  }

  /* ---------- Scoring ---------- */

  function scoreNiche(n) {
    // Numeric dimensions: closeness on a 1–3 scale → 0–2 points each.
    const dims = ["budget", "content", "risk", "marginStyle", "seasonality", "difficulty"];
    let points = 0;
    let max = 0;

    dims.forEach((d) => {
      points += 2 - Math.abs(answers[d] - n[d]);
      max += 2;
    });

    // Interest match is weighted heaviest — passion keeps stores alive.
    max += 4;
    if (n.categories.includes(answers.category)) points += 4;

    return Math.round((points / max) * 100);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
