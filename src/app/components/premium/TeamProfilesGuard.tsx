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
    const cleanups: Array<() => void> = [];

    const apply = () => {
      const section = document.querySelector<HTMLElement>(".team-section");
      if (!section || section.dataset.sbreTeamEnhanced === "true") return;

      section.dataset.sbreTeamEnhanced = "true";

      const intro = section.querySelector<HTMLElement>(".section-heading > p:last-child");
      if (intro) {
        intro.textContent =
          "Soufiane SBRE, Yannick Müller et Zayd Haidar assurent le cadrage, la coordination et le suivi terrain de vos opérations.";
      }

      const grid = section.querySelector<HTMLElement>(".team-grid");
      if (grid && !grid.querySelector(".team-link-network")) {
        const network = document.createElement("div");
        network.className = "team-link-network";
        network.setAttribute("aria-hidden", "true");
        network.innerHTML = `
          <span class="team-link-line team-link-line-a"></span>
          <span class="team-link-line team-link-line-b"></span>
          <span class="team-link-node team-link-node-a"></span>
          <span class="team-link-node team-link-node-b"></span>
          <span class="team-link-node team-link-node-c"></span>
        `;
        grid.prepend(network);
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
        card.dataset.teamIndex = String(index + 1).padStart(2, "0");

        const move = (event: PointerEvent) => {
          if (matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) return;
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          const rx = (0.5 - py) * 8;
          const ry = (px - 0.5) * 10;
          card.style.setProperty("--team-rx", `${rx.toFixed(2)}deg`);
          card.style.setProperty("--team-ry", `${ry.toFixed(2)}deg`);
          card.style.setProperty("--team-mx", `${(px * 100).toFixed(1)}%`);
          card.style.setProperty("--team-my", `${(py * 100).toFixed(1)}%`);
        };
        const leave = () => {
          card.style.setProperty("--team-rx", "0deg");
          card.style.setProperty("--team-ry", "0deg");
          card.style.setProperty("--team-mx", "50%");
          card.style.setProperty("--team-my", "35%");
        };

        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });

      const reveal = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            section.classList.add("team-3d-ready");
            reveal.disconnect();
          }
        },
        { threshold: 0.22 },
      );
      reveal.observe(section);
      cleanups.push(() => reveal.disconnect());

      section.querySelector(".team-note")?.remove();
    };

    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
