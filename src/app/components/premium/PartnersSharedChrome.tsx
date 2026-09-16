import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../../media/Pr_sentation1_page-0001.webp";
import "../../../styles/partners-shared-chrome.css";

function makeButton(label: string, section: string) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.homeSection = section;
  return button;
}

function syncPartnerLogoTone() {
  const image = document.querySelector<HTMLImageElement>(
    ".pr-page .partners-site-header .brand img",
  );
  if (!image) return;

  const isDark = Boolean(document.querySelector(".sbre-theme.theme-dark"));
  image.style.setProperty(
    "filter",
    isDark ? "brightness(0) saturate(100%) invert(100%)" : "none",
    "important",
  );
  image.style.setProperty("opacity", "1", "important");
}

export default function PartnersSharedChrome() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/partenaires") return;

    let cancelled = false;

    const apply = () => {
      if (cancelled) return;
      const page = document.querySelector<HTMLElement>(".pr-page");
      const header = document.querySelector<HTMLElement>(".pr-header");
      const footer = document.querySelector<HTMLElement>(".pr-footer");

      if (page && !page.id) page.id = "accueil";

      if (header && header.dataset.sharedChrome !== "true") {
        header.dataset.sharedChrome = "true";
        header.className = "site-header partners-site-header";

        const brand = document.createElement("a");
        brand.className = "brand";
        brand.href = "#/";
        brand.setAttribute("aria-label", "SBRE Ingénierie — accueil");
        const image = document.createElement("img");
        image.src = logo;
        image.alt = "SBRE Ingénierie";
        image.width = 180;
        image.height = 66;
        brand.appendChild(image);

        const nav = document.createElement("nav");
        nav.className = "desktop-nav";
        nav.setAttribute("aria-label", "Navigation principale");
        [
          ["Expertises", "expertises"],
          ["Réalisations", "réalisations"],
          ["Méthode", "methode"],
          ["Équipe", "equipe"],
        ].forEach(([label, section]) => nav.appendChild(makeButton(label, section)));
        const current = document.createElement("button");
        current.type = "button";
        current.textContent = "Partenaires";
        current.className = "partners-nav-current";
        current.addEventListener("click", () =>
          window.scrollTo({ top: 0, behavior: "smooth" }),
        );
        nav.appendChild(current);

        const contact = makeButton("Demander un entretien ↗", "contact");
        contact.className = "header-contact";

        const menu = document.createElement("button");
        menu.type = "button";
        menu.className = "menu-toggle";
        menu.textContent = "Menu ☰";

        header.replaceChildren(brand, nav, contact, menu);
        header
          .querySelectorAll<HTMLElement>("[data-home-section]")
          .forEach((button) => {
            button.addEventListener("click", () => {
              const section = button.dataset.homeSection;
              if (section) window.location.hash = `/#${section}`;
            });
          });
      }

      if (footer && footer.dataset.sharedChrome !== "true") {
        footer.dataset.sharedChrome = "true";
        footer.className = "site-footer";
      }

      syncPartnerLogoTone();
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
