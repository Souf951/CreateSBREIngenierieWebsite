import type { CSSProperties } from "react";

const partnerNodes = [
  { name: "CityPop", file: "partners/citypop.png", x: 50, y: 49, w: 132, delay: 0.2, featured: true },
  { name: "Wincasa", file: "partners/wincasa.png", x: 20, y: 75, w: 106, delay: 1.5 },
  { name: "G&A Total Contract", file: "partners/ga-total-contract.png", x: 38, y: 18, w: 118, delay: 2.6 },
  { name: "BRS", file: "partners/brs.png", x: 58, y: 68, w: 86, delay: 3.7 },
  { name: "UBS", file: "partners/ubs.png", x: 72, y: 27, w: 94, delay: 4.8 },
  { name: "Police Genève", file: "partners/police-geneve.png", x: 82, y: 72, w: 106, delay: 5.9 },
  { name: "Psy Réunis", file: "partners/psy-reunis.png", x: 91, y: 22, w: 106, delay: 7.0 },
  { name: "Bruellan", file: "partners/bruellan.png", x: 16, y: 49, w: 98, delay: 8.1 },
  { name: "Léman Construction", file: "partners/leman-construction.png", x: 72, y: 86, w: 116, delay: 9.2 },
  { name: "La Boîte des Travaux", file: "partners/nom-partenaire.png", x: 47, y: 88, w: 132, delay: 10.3 },
] as const;

const links = [
  [50, 49, 38, 18, 0.2],
  [50, 49, 20, 75, 0.8],
  [50, 49, 58, 68, 1.4],
  [50, 49, 72, 27, 2.0],
  [50, 49, 16, 49, 2.6],
  [50, 49, 91, 22, 3.2],
  [38, 18, 72, 27, 3.8],
  [20, 75, 58, 68, 4.4],
  [58, 68, 72, 86, 5.0],
  [72, 27, 82, 72, 5.6],
  [72, 27, 91, 22, 6.2],
  [82, 72, 91, 22, 6.8],
  [72, 86, 82, 72, 7.4],
  [16, 49, 20, 75, 8.0],
  [20, 75, 47, 88, 8.6],
  [47, 88, 58, 68, 9.2],
  [47, 88, 72, 86, 9.8],
] as const;

export default function PartnerLogoNetwork() {
  return (
    <div className="pr-logo-network" aria-hidden="true">
      <svg className="pr-logo-network-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {links.map(([x1, y1, x2, y2, delay], index) => (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            pathLength="1"
            style={{ "--network-delay": `${delay}s` } as CSSProperties}
          />
        ))}
      </svg>
      {partnerNodes.map((node) => (
        <div
          className={`pr-logo-network-node${"featured" in node && node.featured ? " pr-logo-network-node-featured" : ""}`}
          key={node.name}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.w}px`,
            "--logo-delay": `${node.delay}s`,
          } as CSSProperties}
        >
          <img
            src={`${import.meta.env.BASE_URL}${node.file}`}
            alt=""
            loading="eager"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}
