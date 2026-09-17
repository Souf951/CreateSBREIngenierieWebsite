function cleanPartnersValueSection() {
  const page = document.querySelector<HTMLElement>(".pr-page");
  if (!page) return;

  page.querySelector<HTMLElement>(".pr-value")?.remove();

  const formEyebrow = page.querySelector<HTMLElement>(".pr-form-intro .pr-eyebrow");
  if (formEyebrow && formEyebrow.textContent?.includes("04 —")) {
    formEyebrow.textContent = "03 — Faisons connaissance";
  }

  const heroCounter = page.querySelector<HTMLElement>(".pr-hero-bottom > span:last-child");
  if (heroCounter?.textContent?.includes("01 — 05")) {
    heroCounter.textContent = "01 — 04";
  }
}

const partnersValueObserver = new MutationObserver(cleanPartnersValueSection);

function startPartnersValueCleanup() {
  cleanPartnersValueSection();
  partnersValueObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startPartnersValueCleanup, { once: true });
} else {
  startPartnersValueCleanup();
}
