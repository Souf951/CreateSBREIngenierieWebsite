import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import PartnerLogoNetwork from "./PartnerLogoNetwork";

const partners = [
  ["CityPop", "partners/citypop.png"],
  ["Wincasa", "partners/wincasa.png"],
  ["G&A Total Contract", "partners/ga-total-contract.png"],
  ["BRS", "partners/brs.png"],
  ["UBS", "partners/ubs.png"],
  ["Police Genève", "partners/police-geneve.png"],
  ["Psy Réunis", "partners/psy-reunis.png"],
  ["Bruellan", "partners/bruellan.png"],
  ["Léman Construction", "partners/leman-construction.png"],
] as const;

function LogoTrack() {
  const items = [...partners, ...partners];
  return (
    <div className="partners-track">
      {items.map(([name, file], index) => (
        <div className="partners-logo-card" key={`${name}-${index}`} aria-hidden={index >= partners.length || undefined}>
          <span className="partners-logo-index">{String((index % partners.length) + 1).padStart(2, "0")}</span>
          <img src={`${import.meta.env.BASE_URL}${file}`} alt={index < partners.length ? name : ""} loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  );
}

export default function PartnersShowcase() {
  const { pathname } = useLocation();
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const ensureHost = () => {
      if (cancelled) return true;

      if (pathname === "/partenaires") {
        const hero = document.querySelector<HTMLElement>(".pr-hero");
        if (!hero) return false;
        setHost(hero);
        return true;
      }

      if (pathname !== "/") {
        setHost(null);
        return true;
      }

      const contact = document.querySelector<HTMLElement>("#contact");
      if (!contact) return false;
      let nextHost = document.querySelector<HTMLElement>(".partners-portal-host");
      if (!nextHost) {
        nextHost = document.createElement("div");
        nextHost.className = "partners-portal-host";
        const previous = contact.previousElementSibling;
        const contactTransition = previous?.classList.contains("projects-method-transition") && previous.getAttribute("data-transition-to") === "06" ? previous : null;
        contact.parentElement?.insertBefore(nextHost, contactTransition ?? contact);
      }
      setHost(nextHost);
      return true;
    };

    if (!ensureHost()) {
      [60, 160, 320, 600, 1000].forEach((delay) => timers.push(window.setTimeout(ensureHost, delay)));
    }

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname]);

  if (!host) return null;

  if (pathname === "/partenaires") {
    return createPortal(<PartnerLogoNetwork />, host);
  }

  if (pathname !== "/") return null;

  return createPortal(
    <section className="partners-showcase" aria-labelledby="partners-title">
      <div className="partners-blueprint" aria-hidden="true" />
      <div className="partners-heading">
        <div>
          <p className="partners-kicker">RÉFÉRENCES & COLLABORATIONS</p>
          <h2 id="partners-title">Des projets menés au contact<br /><span>d’acteurs exigeants.</span></h2>
        </div>
        <p className="partners-note">Entreprises, exploitants, occupants et institutions rencontrés au fil d’opérations réalisées notamment au sein d’entreprises générales et de partenaires de projet.</p>
      </div>
      <div className="partners-marquee" aria-label="Références de projets"><LogoTrack /></div>
      <div className="partners-footer">
        <span>CONSTRUCTION · IMMOBILIER · TERTIAIRE · RÉSIDENTIEL</span>
        <span className="partners-footer-line" aria-hidden="true" />
        <span>SUISSE ROMANDE</span>
      </div>
    </section>,
    host,
  );
}
