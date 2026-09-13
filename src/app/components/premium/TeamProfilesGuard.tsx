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
    image: `${import.meta.env.BASE_URL}team-yannick-muller.webp`,
    alt: "Yannick Müller, chef de projet chez SBRE Ingénierie",
  },
  {
    name: "Zayd Haidar",
    role: "Conducteur de travaux",
    description: "Suivi terrain, contrôle de l’exécution et préparation des réceptions.",
    image: `${import.meta.env.BASE_URL}team-zayd-haidar.webp`,
    alt: "Zayd Haidar, conducteur de travaux chez SBRE Ingénierie",
  },
];

export default function TeamProfilesGuard() {
  useEffect(() => {
    const apply = () => {
      const section = document.querySelector<HTMLElement>(".team-section");
      if (!section) return;

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

    // Apply only a few times after React has rendered the homepage.
    // Do not observe DOM mutations continuously: that can create an update loop.
    const raf = requestAnimationFrame(apply);
    const timers = [150, 500, 1200].map((delay) => window.setTimeout(apply, delay));
    window.addEventListener("hashchange", apply);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", apply);
    };
  }, []);

  return null;
}
