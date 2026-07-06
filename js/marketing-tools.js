/* ==========================================================================
   Marketing Toolkit — tabs, profit calculator, ad copy builder,
   product description generator. All client-side templates + math.
   ========================================================================== */

(function () {
  "use strict";

  /* ==================== Tabs ==================== */

  const tabs = Array.from(document.querySelectorAll(".tab-btn"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(tab);
      if (e.key === "ArrowRight") selectTab(tabs[(i + 1) % tabs.length], true);
      if (e.key === "ArrowLeft") selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true);
    });
  });

  function selectTab(tab, focus) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    panels.forEach((p) => (p.hidden = p.id !== tab.getAttribute("aria-controls")));
    if (focus) tab.focus();
  }

  /* ==================== Profit Margin Calculator ==================== */

  const calcForm = document.getElementById("calc-form");
  const calcResults = document.getElementById("calc-results");
  const calcVerdict = document.getElementById("calc-verdict");

  calcForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const price = num("calc-price");
    const cost = num("calc-cost");
    const shipping = num("calc-shipping");
    const ads = num("calc-ads");

    const profit = price - cost - shipping - ads;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    // Break-even ROAS = revenue needed per $1 of ad spend to cover all costs.
    // Contribution margin before ads:
    const contribution = price - cost - shipping;
    const breakEvenRoas = contribution > 0 ? price / contribution : Infinity;

    out("profit", fmtMoney(profit));
    out("margin", margin.toFixed(1) + "%");
    out("roas", Number.isFinite(breakEvenRoas) ? breakEvenRoas.toFixed(2) + "×" : "—");

    setTone(document.getElementById("metric-profit"), profit >= 10 ? "good" : profit > 0 ? "warn" : "bad");
    setTone(document.getElementById("metric-margin"), margin >= 25 ? "good" : margin > 10 ? "warn" : "bad");
    setTone(
      document.getElementById("metric-roas"),
      !Number.isFinite(breakEvenRoas) ? "bad" : breakEvenRoas <= 2 ? "good" : breakEvenRoas <= 3 ? "warn" : "bad"
    );

    calcResults.hidden = false;
    calcVerdict.hidden = false;
    calcVerdict.textContent = verdictText(profit, margin, breakEvenRoas, ads);
  });

  function verdictText(profit, margin, roas, ads) {
    if (profit <= 0) {
      return "You lose " + fmtMoney(Math.abs(profit)) + " on every sale at these numbers. Raise the price, find a cheaper supplier, or cut the ad cost per sale before launching.";
    }
    if (margin < 15) {
      return "This works, but it's thin — one supplier price hike or ad cost bump puts you underwater. Healthy stores usually keep 20–30%+ margin after ad costs.";
    }
    let text = "Solid: you keep " + fmtMoney(profit) + " (" + margin.toFixed(1) + "%) from every sale.";
    if (ads > 0 && Number.isFinite(roas)) {
      text += " Your ads need to return at least " + roas.toFixed(2) + "× to break even — aim above that in real campaigns.";
    } else if (ads === 0) {
      text += " With free traffic, all of that is yours — this margin also gives you room to test paid ads later.";
    }
    return text;
  }

  function num(id) {
    const v = parseFloat(document.getElementById(id).value);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }

  function out(key, value) {
    document.querySelector('[data-out="' + key + '"]').textContent = value;
  }

  function setTone(metricEl, tone) {
    metricEl.classList.remove("metric-good", "metric-warn", "metric-bad");
    metricEl.classList.add("metric-" + tone);
  }

  function fmtMoney(n) {
    return "$" + n.toFixed(2);
  }

  /* ==================== Ad Copy Builder ==================== */

  const adsForm = document.getElementById("ads-form");
  const adsResults = document.getElementById("ads-results");

  const AD_TEMPLATES = [
    {
      label: "Variant 1 — Problem / Solution",
      build: (d) =>
        "Still putting up with the old way, " + d.audience + "?\n\n" +
        "Our " + d.product + " " + lcFirst(d.benefit) + " — and thousands of customers say they'd never go back.\n\n" +
        "🎁 " + capFirst(d.offer) + "\n" +
        "👉 Shop now before it's gone.",
    },
    {
      label: "Variant 2 — Social Proof Hook",
      build: (d) =>
        "“Why didn't I buy this sooner?” — what we hear most about our " + d.product + ".\n\n" +
        "Built for " + d.audience + ": it " + lcFirst(d.benefit) + ". No gimmicks, just a product that does its job.\n\n" +
        "For a limited time: " + lcFirst(d.offer) + ".\n" +
        "Tap Shop Now and see for yourself.",
    },
    {
      label: "Variant 3 — Direct Offer",
      build: (d) =>
        capFirst(d.offer) + " on the " + d.product + " — this week only.\n\n" +
        "If you're one of the " + d.audience + " who wants to " + lcFirst(d.benefit) + ", this is the sign you've been waiting for.\n\n" +
        "✅ Fast shipping  ✅ Easy returns  ✅ Real support\n" +
        "Claim yours today.",
    },
  ];

  adsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      product: val("ads-product"),
      audience: val("ads-audience"),
      benefit: val("ads-benefit"),
      offer: val("ads-offer"),
    };
    renderOutputs(adsResults, AD_TEMPLATES.map((t) => ({ label: t.label, text: t.build(data) })));
  });

  /* ==================== Product Description Generator ==================== */

  const descForm = document.getElementById("desc-form");
  const descResults = document.getElementById("desc-results");

  descForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = {
      product: val("desc-product"),
      audience: val("desc-audience"),
      benefit: val("desc-benefit"),
      feature: val("desc-feature"),
    };

    const short =
      "The " + d.product + " that " + lcFirst(d.benefit) + ". " +
      "Designed for " + d.audience + ", with " + lcFirst(d.feature) + " — because the details are the difference.";

    const long =
      "Meet the " + d.product + " made with one goal: to help you " + lcFirst(d.benefit) + ".\n\n" +
      "We designed it specifically for " + d.audience + " — people who notice the difference between something that works and something that works beautifully. " +
      "The standout detail? " + capFirst(d.feature) + ". It's the kind of thoughtful touch you didn't know you needed until you can't live without it.\n\n" +
      "Why you'll love it:\n" +
      "• " + capFirst(d.benefit) + "\n" +
      "• " + capFirst(d.feature) + "\n" +
      "• Quality you can feel the moment you unbox it\n\n" +
      "Add it to your cart today — and see why customers keep coming back.";

    renderOutputs(descResults, [
      { label: "Short description — for collection pages & ads", text: short },
      { label: "Long description — for your product page", text: long },
    ]);
  });

  /* ==================== Shared output rendering ==================== */

  function renderOutputs(container, items) {
    container.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "output-card";

      const head = document.createElement("div");
      head.className = "output-head";

      const label = document.createElement("span");
      label.className = "output-label";
      label.textContent = item.label;

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "icon-btn";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", () => copyText(copyBtn, item.text));

      const body = document.createElement("p");
      body.textContent = item.text;

      head.append(label, copyBtn);
      card.append(head, body);
      container.appendChild(card);
    });
  }

  async function copyText(btn, text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 1600);
  }

  /* ==================== Small helpers ==================== */

  function val(id) {
    return document.getElementById(id).value.trim();
  }
  function capFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function lcFirst(s) {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }
})();
