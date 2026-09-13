import { useEffect } from "react";

const profiles = [
  {
    name: "Soufiane SBRE",
    role: "Directeur",
    description: "Cadrage du mandat, arbitrages et direction des opérations.",
    image: null,
    alt: "Soufiane SBRE, directeur de SBRE Ingénierie",
  },
  {
    name: "Yannick Müller",
    role: "Chef de projet",
    description: "Organisation, planification et coordination des intervenants.",
    image: `${import.meta.env.BASE_URL}team-zayd-haidar.webp`,
    alt: "Yannick Müller, chef de projet chez SBRE Ingénierie",
  },
  {
    name: "Zayd Haidar",
    role: "Conducteur de travaux",
    description: "Suivi terrain, contrôle de l’exécution et préparation des réceptions.",
    image: `${import.meta.env.BASE_URL}team-yannick-muller.webp`,
    alt: "Zayd Haidar, conducteur de travaux chez SBRE Ingénierie",
  },
];

export default function TeamProfilesGuard() {
  useEffect(() => {
    const apply = () => {
      const section = document.querySelector<HTMLElement>(".team-section");
      if (!section || section.dataset.sbreTeamEnhanced === "true") return;

      section.dataset.sbreTeamEnhanced = "true";
      section.style.setProperty(
        "--team-bg",
        `url("${import.meta.env.BASE_URL}team-office-bg.webp")`,
      );

      const intro = section.querySelector<HTMLElement>(".section-heading > p:last-child");
      if (intro) {
        intro.textContent =
          "Soufiane SBRE, Yannick Müller et Zayd Haidar assurent le cadrage, la coordination et le suivi terrain de vos opérations.";
      }

      const cards = Array.from(section.querySelectorAll<HTMLElement>(".team-card"));
      cards.forEach((card, index) => {
        const profile = profiles[index];
        if (!profile) return;

        const img = card.querySelector<HTMLImageElement>("img");
        const name = card.querySelector<HTMLElement>("h3");
        const role = card.querySelector<HTMLElement>(".team-role");
        const description = card.querySelector<HTMLElement>("p:last-child");

        if (img) {
          if (profile.image) img.src = profile.image;
          img.alt = profile.alt;
        }
        if (name) name.textContent = profile.name;
        if (role) role.textContent = profile.role;
        if (description) description.textContent = profile.description;

        card.querySelector(".provisional")?.remove();
      });

      section.querySelector(".team-note")?.remove();
    };

    apply();

    // HomePage can disappear/reappear when opening a project page. Observe only
    // child additions and enhance each new team section once. The data marker
    // prevents mutation loops and protects previous customisations.
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
