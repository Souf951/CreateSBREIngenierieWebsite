import { useEffect } from "react";

export default function HomeCopyGuard() {
  useEffect(() => {
    const setHtmlIfChanged = (el: HTMLElement | null, html: string) => {
      if (el && el.innerHTML !== html) el.innerHTML = html;
    };

    const setTextIfChanged = (el: HTMLElement | null, text: string) => {
      if (el && el.textContent !== text) el.textContent = text;
    };

    const apply = () => {
      const home = document.querySelector<HTMLElement>(".premium-site");
      if (!home) return;

      setHtmlIfChanged(
        home.querySelector<HTMLElement>(".header-contact"),
        'Demander un entretien <span>↗</span>',
      );

      setHtmlIfChanged(
        home.querySelector<HTMLElement>(".hero-copy h1"),
        'Direction de travaux et pilotage de chantier<br><span class="hero-title-location">en Suisse romande.</span>',
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>(".hero-description"),
        "Nous assurons le suivi technique, la gestion financière et la coordination des entreprises. Vous gardez la vision globale ; nous pilotons l’exécution jusqu’à la réception.",
      );

      const heroActions = home.querySelectorAll<HTMLElement>(".hero-actions button");
      setHtmlIfChanged(heroActions[0] ?? null, 'Discuter de votre projet <span>↗</span>');
      setHtmlIfChanged(heroActions[1] ?? null, 'Nos références <span>↗</span>');

      setHtmlIfChanged(
        home.querySelector<HTMLElement>("#expertises .section-heading h2"),
        'Un pilotage rigoureux<br><span>à chaque étape du chantier.</span>',
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>("#expertises .section-heading > p:last-child"),
        "Nous épaulons maîtres d’ouvrage et architectes sur le terrain. De l’appel d’offres à la levée des réserves, nous sécurisons les coûts, les délais et la qualité d’exécution.",
      );
    };

    apply();

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        apply();
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
