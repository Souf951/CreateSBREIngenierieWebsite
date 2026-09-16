import { useEffect, useRef } from "react";
import PartnerArchitecture from "./PartnerArchitecture";
import { clamp, partnerStages, stageOpacity } from "./partnerStory";

export default function PartnerScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Native sticky + one scheduled paint per scroll: reversible, no timer or scroll hijacking.
    const media = matchMedia(
      "(min-width: 900px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
    );
    const panels = Array.from(
      section.querySelectorAll<HTMLElement>(".pr-story-panel"),
    );
    const buttons = Array.from(
      section.querySelectorAll<HTMLButtonElement>(".pr-story-nav button"),
    );
    let frame = 0;
    let active = -1;
    function paint() {
      frame = 0;
      if (!section || !media.matches) return;
      const rect = section.getBoundingClientRect();
      const progress = clamp(
        -rect.top / Math.max(1, section.offsetHeight - window.innerHeight),
      );
      section.style.setProperty("--story-progress", String(progress));
      for (let i = 0; i < 5; i++) {
        const opacity = stageOpacity(progress, i);
        panels[i].style.opacity = String(opacity);
        panels[i].style.transform = `translateY(${(i - progress * 4) * 18}px)`;
        section.style.setProperty(
          `--floor-${i}`,
          String(clamp(progress * 1.6 - i * 0.14 + 0.08)),
        );
        if (i < 4)
          section.style.setProperty(
            `--connection-${i}`,
            String(clamp(progress * 4 - i + 0.65)),
          );
      }
      section.style.setProperty(
        "--crown",
        String(clamp((progress - 0.55) / 0.4)),
      );
      const next = Math.round(progress * 4);
      if (next !== active) {
        active = next;
        panels.forEach((panel, i) =>
          panel.setAttribute("aria-hidden", String(i !== next)),
        );
        buttons.forEach((button, i) =>
          i === next
            ? button.setAttribute("aria-current", "step")
            : button.removeAttribute("aria-current"),
        );
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    function configure() {
      section!.classList.toggle("is-scrub", media.matches);
      active = -1;
      if (media.matches) paint();
      else
        panels.forEach((panel) => {
          panel.removeAttribute("style");
          panel.removeAttribute("aria-hidden");
        });
    }
    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", configure);
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", configure);
      resize.disconnect();
    };
  }, []);

  function goToStage(index: number) {
    const section = sectionRef.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({
      top: top + ((section.offsetHeight - window.innerHeight) * index) / 4,
      behavior: "smooth",
    });
  }

  return (
    <section
      ref={sectionRef}
      className="pr-story"
      id="coordination"
      aria-labelledby="pr-story-title"
    >
      <div className="pr-story-sticky">
        <div className="pr-story-heading">
          <p className="pr-eyebrow">01 — L’art de coordonner</p>
          <h2 id="pr-story-title">
            Des expertises distinctes.
            <br />
            <span>Une même direction.</span>
          </h2>
          <span className="pr-story-instruction">
            Le projet se construit au fil du scroll ↓
          </span>
        </div>
        <div className="pr-story-body">
          <div className="pr-story-panels">
            {partnerStages.map((stage, i) => (
              <article className="pr-story-panel" key={stage.role}>
                <p className="pr-eyebrow">
                  <span className="pr-step-index">0{i + 1}</span>
                  {stage.role}
                </p>
                <h3>{stage.title}</h3>
                <p className="pr-story-detail">{stage.detail}</p>
                <p className="pr-story-message">{stage.text}</p>
                <svg
                  className="pr-mobile-mark"
                  viewBox="0 0 200 60"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d={`M0 50H${25 + i * 25}V10H200`}
                    stroke="currentColor"
                  />
                  <circle cx={25 + i * 25} cy="10" r="3" fill="currentColor" />
                </svg>
              </article>
            ))}
          </div>
          <div className="pr-story-visual" aria-hidden="true">
            <PartnerArchitecture narrative />
            <svg className="pr-connections" viewBox="0 0 900 660" fill="none">
              {[
                "M108 122H265L405 207",
                "M760 176H691L617 282",
                "M777 544H671L586 423",
                "M113 508H232L367 405",
              ].map((d, i) => (
                <g key={d} className={`pr-connection pr-connection-${i}`}>
                  <path d={d} pathLength="1" />
                  <circle
                    cx={[108, 760, 777, 113][i]}
                    cy={[122, 176, 544, 508][i]}
                    r="3"
                  />
                </g>
              ))}
            </svg>
            <span className="pr-actor pr-actor-0">Architecte</span>
            <span className="pr-actor pr-actor-1">Entreprises</span>
            <span className="pr-actor pr-actor-2">Maître d’ouvrage</span>
            <span className="pr-actor pr-actor-3">Direction de travaux</span>
            <span className="pr-model-caption">
              SBRE / Au cœur de la coordination
            </span>
          </div>
        </div>
        <nav className="pr-story-nav" aria-label="Étapes de la coordination">
          {partnerStages.map((stage, i) => (
            <button key={stage.role} onClick={() => goToStage(i)}>
              <span>0{i + 1}</span>
              {stage.role}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
