function cleanPartnersSections() {
  const page = document.querySelector<HTMLElement>(".pr-page");
  if (!page) return;

  page.querySelector<HTMLElement>(".pr-value")?.remove();
  page.querySelector<HTMLElement>(".pr-final")?.remove();

  const formEyebrow = page.querySelector<HTMLElement>(".pr-form-intro .pr-eyebrow");
  if (formEyebrow) {
    formEyebrow.textContent = "03 — Faisons connaissance";
  }

  const heroCounter = page.querySelector<HTMLElement>(".pr-hero-bottom > span:last-child");
  if (heroCounter) {
    heroCounter.textContent = "01 — 03";
  }
}

const partnersSectionsObserver = new MutationObserver(cleanPartnersSections);

function startPartnersSectionsCleanup() {
  cleanPartnersSections();
  partnersSectionsObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startPartnersSectionsCleanup, { once: true });
} else {
  startPartnersSectionsCleanup();
}
