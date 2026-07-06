/* ==========================================================================
   Store Name Generator — word banks + patterns, all client-side.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Word banks per style ---------- */
  const BANKS = {
    playful: {
      prefixes: ["Happy", "Snug", "Zippy", "Bright", "Lucky", "Wiggle", "Pop", "Sunny", "Cheeky", "Bounce"],
      suffixes: ["ly", "sy", "oo", "ie", "za", "beam", "pop", "joy", "dash", "spark"],
      nouns: ["Nest", "Buddy", "Box", "Party", "Club", "Crew", "Land", "Patch", "Splash", "Wagon"],
      modifiers: ["Fun", "Fresh", "Whiz", "Magic", "Happy", "Merry"],
    },
    premium: {
      prefixes: ["Aur", "Vel", "Lux", "Nova", "Maison", "Ever", "Noble", "Grand", "Prime", "Regal"],
      suffixes: ["oria", "elle", "ance", "ora", "aire", "ley", "mont", "vale", "line", "haus"],
      nouns: ["House", "Atelier", "Reserve", "Estate", "Collection", "Society", "Heritage", "Studio", "Gallery", "Vault"],
      modifiers: ["Fine", "Luxe", "Prime", "Signature", "Select", "Royal"],
    },
    minimal: {
      prefixes: ["No", "Mono", "Bare", "Pure", "True", "Plain", "Solo", "Zen", "Form", "Base"],
      suffixes: ["o", "a", "ik", "on", "ea", "um", "ist", "eno", "ora", "ile"],
      nouns: ["Studio", "Lab", "Form", "Object", "Goods", "Supply", "Works", "Space", "Basics", "Union"],
      modifiers: ["Simple", "Pure", "Daily", "Core", "Modern", "Honest"],
    },
  };

  // Style-agnostic evocative words to widen the mix
  const EVOCATIVE = ["Ember", "Harbor", "Meadow", "Summit", "Willow", "Orbit", "Canvas", "Drift", "Pine", "Coast", "Bloom", "Arrow"];

  const form = document.getElementById("gen-form");
  const keywordInput = document.getElementById("gen-keyword");
  const resultsEl = document.getElementById("gen-results");
  const genBtn = document.getElementById("gen-btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = keywordInput.value.trim();
    if (!keyword) return;
    const style = form.querySelector('input[name="style"]:checked').value;
    render(generateNames(keyword, style, 10));
    genBtn.textContent = "Regenerate";
  });

  /* ---------- Generation ---------- */

  function generateNames(keyword, style, count) {
    const bank = BANKS[style];
    const kw = titleCase(keyword.replace(/\s+/g, " "));
    const kwCompact = kw.replace(/\s+/g, "");
    const names = new Set();
    let guard = 0;

    // Each pattern builds one candidate; we cycle through patterns until we
    // have `count` unique names.
    const patterns = [
      () => pick(bank.prefixes) + kwCompact.toLowerCase(),                    // compound: prefix+keyword
      () => kwCompact + pick(bank.suffixes),                                  // portmanteau-ish: keyword+suffix
      () => "The " + kw + " " + pick(["Co.", "Shop", "Store", "Company"]),    // The ___ Co.
      () => kw + " " + pick(bank.nouns),                                      // keyword + noun
      () => pick(bank.modifiers) + " " + kw,                                  // modifier + keyword
      () => pick(EVOCATIVE) + " & " + kw,                                     // evocative & keyword
      () => portmanteau(pick(bank.prefixes), kwCompact),                      // blended portmanteau
      () => kwCompact + " " + pick(["HQ", "Hub", "House", "Market"]),         // keyword + place
      () => pick(EVOCATIVE) + " " + pick(bank.nouns),                         // evocative + noun (brandable, no keyword)
      () => pick(bank.prefixes) + pick(bank.suffixes) + " " + kw,             // invented word + keyword
    ];

    while (names.size < count && guard < 200) {
      guard++;
      const name = tidy(patterns[guard % patterns.length]());
      if (name.length >= 3 && name.length <= 30) names.add(name);
    }
    return [...names];
  }

  function portmanteau(a, b) {
    // Overlap the end of `a` with the start of `b` at a vowel boundary if possible
    const cut = Math.max(2, Math.ceil(a.length / 2));
    return titleCase(a.slice(0, cut) + b.toLowerCase());
  }

  function tidy(name) {
    return titleCase(name.replace(/\s+/g, " ").trim());
  }

  function titleCase(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---------- Rendering ---------- */

  function render(names) {
    resultsEl.innerHTML = "";
    names.forEach((name, i) => {
      const domain = name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const item = document.createElement("div");
      item.className = "result-item";
      item.style.setProperty("--i", i);

      const nameEl = document.createElement("span");
      nameEl.className = "result-name";
      nameEl.textContent = name;

      const actions = document.createElement("div");
      actions.className = "result-actions";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "icon-btn";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", () => copyName(copyBtn, name));

      const domainLink = document.createElement("a");
      domainLink.className = "icon-btn";
      domainLink.href = "https://www.namecheap.com/domains/registration/results/?domain=" + domain + ".com";
      domainLink.target = "_blank";
      domainLink.rel = "noopener";
      domainLink.textContent = "Check domain";

      actions.append(copyBtn, domainLink);
      item.append(nameEl, actions);
      resultsEl.appendChild(item);
    });
  }

  async function copyName(btn, name) {
    try {
      await navigator.clipboard.writeText(name);
    } catch (err) {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = name;
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
})();
