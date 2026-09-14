import { useEffect } from "react";

export default function HomeCopyGuard() {
  useEffect(() => {
    const apply = () => {
      const home = document.querySelector<HTMLElement>(".premium-site");
      if (!home) return;

      const headerCta = home.querySelector<HTMLButtonElement>(".header-contact");
      if (headerCta) headerCta.innerHTML = 'Demander un entretien <span>↗</span>';

      const heroTitle = home.querySelector<HTMLElement>(".hero-copy h1");
      if (heroTitle) {
        heroTitle.innerHTML = 'Direction de travaux et pilotage de chantier<br><span class="hero-title-location">en Suisse romande.</span>';
      }

      const heroDescription = home.querySelector<HTMLElement>(".hero-description");
      if (heroDescription) {
        heroDescription.textContent =
          "Nous assurons le suivi technique, la gestion financière et la coordination des entreprises. Vous gardez la vision globale ; nous pilotons l’exécution jusqu’à la réception.";
      }

      const heroActions = home.querySelectorAll<HTMLButtonElement>(".hero-actions button");
      if (heroActions[0]) heroActions[0].innerHTML = 'Discuter de votre projet <span>↗</span>';
      if (heroActions[1]) heroActions[1].innerHTML = 'Nos références <span>↗</span>';

      const expertiseHeading = home.querySelector<HTMLElement>("#expertises .section-heading h2");
      if (expertiseHeading) {
        expertiseHeading.innerHTML = 'Un pilotage rigoureux<br><span>à chaque étape du chantier.</span>';
      }

      const expertiseIntro = home.querySelector<HTMLElement>("#expertises .section-heading > p:last-child");
      if (expertiseIntro) {
        expertiseIntro.textContent =
          "Nous épaulons maîtres d’ouvrage et architectes sur le terrain. De l’appel d’offres à la levée des réserves, nous sécurisons les coûts, les délais et la qualité d’exécution.";
      }
    };

    apply();
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
