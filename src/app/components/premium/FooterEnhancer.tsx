import { useEffect } from "react";
import logo from "../../../media/Pr_sentation1_page-0001.webp";

export default function FooterEnhancer() {
  useEffect(() => {
    const apply = () => {
      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (!footer || footer.dataset.enhanced === "true") return;

      footer.dataset.enhanced = "true";
      footer.classList.add("site-footer-premium");
      footer.innerHTML = "";

      const top = document.createElement("div");
      top.className = "footer-premium-top";

      const brand = document.createElement("div");
      brand.className = "footer-premium-brand";
      const img = document.createElement("img");
      img.src = logo;
      img.alt = "SBRE Ingénierie";
      img.loading = "lazy";
      brand.appendChild(img);

      const tagline = document.createElement("p");
      tagline.textContent = "Structurer · Budgéter · Réaliser · Exiger";
      brand.appendChild(tagline);

      const contact = document.createElement("div");
      contact.className = "footer-premium-contact";
      contact.innerHTML = `
        <span class="footer-premium-kicker">DIRECTION DE TRAVAUX · SUISSE ROMANDE</span>
        <a href="tel:+41783076029">+41 78 307 60 29 ↗</a>
        <a href="mailto:info@sbre-ingenierie.ch">info@sbre-ingenierie.ch ↗</a>
        <span class="footer-premium-area">Lausanne · Genève · Vaud</span>
      `;

      top.appendChild(brand);
      top.appendChild(contact);

      const bottom = document.createElement("div");
      bottom.className = "footer-premium-bottom";

      const copyright = document.createElement("span");
      copyright.textContent = `© ${new Date().getFullYear()} SBRE Ingénierie`;

      const promise = document.createElement("span");
      promise.className = "footer-premium-promise";
      promise.textContent = "Les décisions justes. Au bon moment.";

      const back = document.createElement("button");
      back.type = "button";
      back.textContent = "Retour en haut ↑";
      back.addEventListener("click", () => {
        document.getElementById("accueil")?.scrollIntoView({ behavior: "smooth" });
      });

      bottom.appendChild(copyright);
      bottom.appendChild(promise);
      bottom.appendChild(back);

      footer.appendChild(top);
      footer.appendChild(bottom);
    };

    apply();

    // Footer belongs to HomePage and can be recreated after visiting project pages.
    // Enhance each new footer once without rewriting unrelated sections.
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
