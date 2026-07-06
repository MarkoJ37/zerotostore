/* ==========================================================================
   main.js — nav, scroll reveals, email capture (Formspree)
   Loaded on every page.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — paste your Formspree form ID here (see README.md).
   Example: if your form endpoint is https://formspree.io/f/xdoqwxyz
   then FORMSPREE_FORM_ID = "xdoqwxyz".
   -------------------------------------------------------------------------- */
const FORMSPREE_FORM_ID = "FORM_ID"; // <-- REPLACE with your real Formspree ID

/* ---------- Email capture forms ---------- */
document.querySelectorAll("form[data-capture]").forEach((form) => {
  form.setAttribute("action", "https://formspree.io/f/" + FORMSPREE_FORM_ID);
  form.setAttribute("method", "POST");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const successBox = form.querySelector(".form-success");
    const submitBtn = form.querySelector('button[type="submit"]');
    form.classList.add("is-submitting");

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        showSuccess();
      } else {
        // Formspree rejected (bad ID, spam filter…). Don't strand the user.
        showSuccess();
        console.warn("Formspree returned " + res.status + " — check FORMSPREE_FORM_ID in js/main.js");
      }
    } catch (err) {
      // Network error — still show the success state so the PDF link is reachable.
      showSuccess();
      console.warn("Form submit failed:", err);
    }

    function showSuccess() {
      form.classList.remove("is-submitting");
      form.querySelectorAll("input[type='email']").forEach((i) => (i.style.display = "none"));
      if (submitBtn) submitBtn.style.display = "none";
      if (successBox) successBox.hidden = false;
    }
  });
});

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu when a link inside it is clicked (mobile UX)
  navMenu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Scroll reveal ---------- */
const reveals = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reveals.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  }
}

/* ---------- Footer year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
