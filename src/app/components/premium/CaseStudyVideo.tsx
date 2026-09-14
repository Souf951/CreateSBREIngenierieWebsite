import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ActiveCase = "01" | "02" | "03" | null;

export default function CaseStudyVideo() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [activeCase, setActiveCase] = useState<ActiveCase>(null);

  useEffect(() => {
    const sync = () => {
      const nextHost = document.querySelector<HTMLElement>(".case-section .case-image");
      const active = document.querySelector<HTMLButtonElement>(
        '.case-section .case-tabs button[aria-pressed="true"]',
      );
      const activeNumber = active?.querySelector("span")?.textContent?.trim();
      const nextCase: ActiveCase =
        activeNumber === "01" || activeNumber === "02" || activeNumber === "03"
          ? activeNumber
          : null;

      setHost(nextHost);
      setActiveCase(nextCase);
      nextHost?.classList.toggle("has-sbre-case-video", Boolean(nextCase));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-pressed"],
    });

    return () => {
      observer.disconnect();
      document
        .querySelector<HTMLElement>(".case-section .case-image")
        ?.classList.remove("has-sbre-case-video");
    };
  }, []);

  if (!host || !activeCase) return null;

  const videoFile =
    activeCase === "01"
      ? "sbre-case-coordination.mp4"
      : activeCase === "02"
        ? "sbre-case-planning.mp4"
        : "sbre-case-reception.mp4";

  return createPortal(
    <video
      key={videoFile}
      className={`sbre-case-card-video is-active case-${activeCase}`}
      src={`${import.meta.env.BASE_URL}${videoFile}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />,
    host,
  );
}
