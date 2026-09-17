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

      home.querySelector<HTMLElement>(".visual-heading")?.remove();

      const building = home.querySelector<HTMLElement>(".building-canvas");
      if (building && building.dataset.frontAligned !== "true") {
        building.dataset.frontAligned = "true";
        requestAnimationFrame(() => {
          building.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
          building.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
          building.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        });
      }

      setHtmlIfChanged(
        home.querySelector<HTMLElement>("#expertises .section-heading h2"),
        'Un pilotage rigoureux<br><span>à chaque étape du chantier.</span>',
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>("#expertises .section-heading > p:last-child"),
        "Nous épaulons maîtres d’ouvrage et architectes sur le terrain. De l’appel d’offres à la levée des réserves, nous sécurisons les coûts, les délais et la qualité d’exécution.",
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>("#réalisations .section-heading .eyebrow"),
        "04 / SÉLECTION DE RÉFÉRENCES",
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>("#réalisations .section-heading > p:last-child"),
        "Trois opérations représentatives, sélectionnées parmi plusieurs expériences de direction et de suivi de travaux. Elles illustrent des typologies et des enjeux différents ; le détail des missions et collaborations figure dans chaque fiche projet.",
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>("#equipe .section-heading h2"),
        "Une direction impliquée sur chaque chantier.",
      );

      setTextIfChanged(
        home.querySelector<HTMLElement>("#equipe .section-heading > p:last-child"),
        "Soufiane SBRE, Yannick Müller et Zayd Haidar assurent le cadrage, la coordination et le suivi terrain de vos opérations.",
      );

      const teamRoles = home.querySelectorAll<HTMLElement>("#equipe .team-card .team-role");
      const roles = [
        ["MANAGING DIRECTOR & HEAD OF OPERATIONS", "Directeur"],
        ["HEAD OF PROJECT MANAGEMENT", "Chef de projet"],
        ["HEAD OF CONSTRUCTION MANAGEMENT", "Directeur de travaux"],
      ];

      teamRoles.forEach((role, index) => {
        const item = roles[index];
        if (!item) return;
        const [roleEn, roleFr] = item;
        setHtmlIfChanged(
          role,
          `<span class="team-role-en">${roleEn}</span><span class="team-role-fr">${roleFr}</span>`,
        );
        role.setAttribute("aria-label", `${roleEn} — ${roleFr}`);
      });
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
