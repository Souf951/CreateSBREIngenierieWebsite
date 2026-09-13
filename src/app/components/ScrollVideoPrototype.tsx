import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/scroll-video-prototype.css";

const steps = [
  {
    label: "01 / FONDATIONS",
    title: "Préparer le terrain.",
    body: "Le scroll pilote directement la vidéo : terrassement, premières interventions et lancement du chantier.",
  },
  {
    label: "02 / STRUCTURE",
    title: "Faire monter l’ouvrage.",
    body: "En continuant à descendre, la vidéo avance progressivement vers la structure sans saut brutal.",
  },
  {
    label: "03 / ENVELOPPE",
    title: "Fermer et protéger.",
    body: "La progression du scroll vous amène naturellement vers les façades, vitrages et fermetures du bâtiment.",
  },
  {
    label: "04 / FINITIONS",
    title: "Livrer le détail.",
    body: "Dernière portion : finitions, aménagements et rendu final. Remontez pour revenir en arrière dans la vidéo.",
  },
];

export default function ScrollVideoPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(44.177);
  const [videoMissing, setVideoMissing] = useState(false);

  const activeStep = useMemo(
    () => Math.min(3, Math.max(0, Math.floor(progress * 4))),
    [progress],
  );

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video || videoMissing) return;

      const rect = section.getBoundingClientRect();
      const total = Math.max(1, section.offsetHeight - window.innerHeight);
      const travelled = Math.min(total, Math.max(0, -rect.top));
      const p = travelled / total;
      setProgress(p);

      const targetTime = p * duration;
      if (Number.isFinite(targetTime) && Math.abs(video.currentTime - targetTime) > 0.025) {
        try {
          video.currentTime = targetTime;
        } catch {
          /* Seeking can briefly fail while metadata is loading. */
        }
      }
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [duration, videoMissing]);

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const total = section.offsetHeight - window.innerHeight;
    const target = section.offsetTop + total * (index / 3);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <main className="scroll-demo-page">
      <section className="scroll-demo-intro">
        <p>SBRE / PROTOTYPE INTERACTIF</p>
        <h1>
          Le chantier avance
          <br />
          <em>avec votre scroll.</em>
        </h1>
        <p>
          Descendez doucement. La page reste accrochée à l’écran et la vidéo avance
          exactement au rythme de votre molette. Remontez : elle repart en arrière.
        </p>
        <span>↓ Commencez à défiler</span>
      </section>

      <section ref={sectionRef} className="scroll-scrub-section" aria-label="Prototype de vidéo pilotée par le scroll">
        <div className="scroll-scrub-sticky">
          <video
            ref={videoRef}
            className="scroll-scrub-video"
            src={`${import.meta.env.BASE_URL}sbre-scroll-demo.mp4`}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(event) => {
              const value = event.currentTarget.duration;
              if (Number.isFinite(value) && value > 0) setDuration(value);
              event.currentTarget.pause();
              event.currentTarget.currentTime = 0;
            }}
            onError={() => setVideoMissing(true)}
          />
          <div className="scroll-scrub-shade" />

          {videoMissing && (
            <div className="scroll-video-missing">
              <span>Prototype prêt</span>
              <strong>Ajoutez la vidéo dans public/sbre-scroll-demo.mp4</strong>
              <p>Le code de scroll est déjà actif ; il ne manque que le fichier vidéo local.</p>
            </div>
          )}

          <div className="scroll-scrub-ui">
            <div className="scroll-scrub-topline">
              <span>SBRE INGÉNIERIE</span>
              <span>{String(Math.round(progress * 100)).padStart(2, "0")}%</span>
            </div>

            <div className="scroll-scrub-copy" key={activeStep}>
              <p>{steps[activeStep].label}</p>
              <h2>{steps[activeStep].title}</h2>
              <span>{steps[activeStep].body}</span>
            </div>

            <div className="scroll-scrub-timeline" aria-label="Étapes de construction">
              {steps.map((step, index) => {
                const threshold = index / 3;
                return (
                  <button
                    key={step.label}
                    type="button"
                    className={activeStep === index ? "is-active" : ""}
                    onClick={() => jumpTo(index)}
                    aria-label={`Aller à ${step.label}`}
                  >
                    <i>
                      <b style={{ transform: `scaleX(${Math.min(1, Math.max(0, (progress - threshold + 1 / 3) * 3))})` }} />
                    </i>
                    <span>0{index + 1}</span>
                    <strong>{step.label.split(" / ")[1]}</strong>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-demo-outro">
        <p>FIN DU PROTOTYPE</p>
        <h2>Le scroll redevient normal.</h2>
        <p>
          Si l’effet te plaît, on pourra ensuite l’intégrer directement dans la homepage
          avec les textes SBRE définitifs et un vrai découpage des phases de chantier.
        </p>
      </section>
    </main>
  );
}
