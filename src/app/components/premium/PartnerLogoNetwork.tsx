import type { CSSProperties } from "react";

const partnerNodes = [
  { name: "CityPop", file: "partners/citypop.png", x: 8, y: 22, w: 72, delay: 0.8 },
  { name: "Wincasa", file: "partners/wincasa.png", x: 23, y: 74, w: 78, delay: 2.2 },
  { name: "G&A Total Contract", file: "partners/ga-total-contract.png", x: 39, y: 15, w: 92, delay: 3.6 },
  { name: "BRS", file: "partners/brs.png", x: 53, y: 62, w: 58, delay: 5.0 },
  { name: "UBS", file: "partners/ubs.png", x: 67, y: 28, w: 64, delay: 6.4 },
  { name: "Police Genève", file: "partners/police-geneve.png", x: 81, y: 71, w: 74, delay: 7.8 },
  { name: "Psy Réunis", file: "partners/psy-reunis.png", x: 91, y: 21, w: 76, delay: 9.2 },
  { name: "Bruellan", file: "partners/bruellan.png", x: 13, y: 53, w: 70, delay: 10.6 },
  { name: "Léman Construction", file: "partners/leman-construction.png", x: 72, y: 84, w: 88, delay: 12.0 },
  { name: "La Boîte des Travaux", file: "partners/nom-partenaire.png", x: 47, y: 86, w: 112, delay: 13.2 },
] as const;

const links = [
  [8, 22, 13, 53, 0.2], [13, 53, 23, 74, 1.1], [8, 22, 39, 15, 1.8],
  [39, 15, 53, 62, 3.1], [23, 74, 53, 62, 4.0], [39, 15, 67, 28, 4.8],
  [53, 62, 67, 28, 5.6], [53, 62, 72, 84, 6.2], [67, 28, 81, 71, 6.8],
  [67, 28, 91, 21, 7.4], [81, 71, 91, 21, 8.3], [72, 84, 81, 71, 9.1],
  [13, 53, 53, 62, 9.8], [23, 74, 72, 84, 10.5], [39, 15, 91, 21, 11.2],
  [23, 74, 47, 86, 11.8], [47, 86, 53, 62, 12.2], [47, 86, 72, 84, 12.8],
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
          className="pr-logo-network-node"
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
