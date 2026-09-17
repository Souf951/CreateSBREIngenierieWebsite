import { useEffect, useRef } from "react";
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
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const flowLines = Array.from(svg.querySelectorAll<SVGLineElement>(".pr-network-flow-line"));
    const pulses = Array.from(svg.querySelectorAll<SVGCircleElement>(".pr-network-pulse"));

    let frame = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const seconds = (now - startedAt) / 1000;

      flowLines.forEach((line, index) => {
        const offset = -((seconds * 0.22 + index * 0.085) % 1);
        line.style.strokeDashoffset = String(offset);
        line.style.opacity = String(0.48 + Math.sin(seconds * 1.8 + index * 0.6) * 0.16);
      });

      pulses.forEach((pulse, index) => {
        const [x1, y1, x2, y2] = links[index];
        const phase = (seconds * 0.095 + index * 0.083) % 1;
        const eased = phase < 0.5
          ? 2 * phase * phase
          : 1 - Math.pow(-2 * phase + 2, 2) / 2;
        const x = x1 + (x2 - x1) * eased;
        const y = y1 + (y2 - y1) * eased;
        const visibility = Math.sin(Math.PI * phase);

        pulse.setAttribute("cx", x.toFixed(3));
        pulse.setAttribute("cy", y.toFixed(3));
        pulse.style.opacity = String(Math.max(0.08, visibility * 0.95));
        pulse.setAttribute("r", (0.34 + visibility * 0.22).toFixed(3));
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pr-logo-network" aria-hidden="true">
      <svg
        ref={svgRef}
        className="pr-logo-network-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="pr-network-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {links.map(([x1, y1, x2, y2], index) => (
          <g key={`connection-${index}`}>
            <line
              className="pr-network-base-line"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              pathLength="1"
            />
            <line
              className="pr-network-flow-line"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              pathLength="1"
            />
            <circle
              className="pr-network-pulse"
              cx={x1}
              cy={y1}
              r="0.42"
              filter="url(#pr-network-glow)"
            />
          </g>
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
