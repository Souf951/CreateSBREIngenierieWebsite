import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import tertiaire1 from "../../../media/1721891230963.webp";
import tertiaire2 from "../../../media/1721891231094.webp";
import tertiaire3 from "../../../media/1721891230808.webp";
import micro1 from "../../../media/1746172633498-2.webp";
import micro2 from "../../../media/1746172634781-2.webp";
import micro3 from "../../../media/1746172642405-2.webp";

const images = [tertiaire1, tertiaire2, tertiaire3, micro1, micro2, micro3];

export default function ExperiencesResultsBackground() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const syncHost = () => {
      setHost(document.querySelector<HTMLElement>("#réalisations"));
    };

    syncHost();
    const observer = new MutationObserver(syncHost);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!host) return null;

  return createPortal(
    <div className="experiences-results-bg" aria-hidden="true">
      {images.map((src, imageIndex) => (
        <img
          key={src}
          src={src}
          alt=""
          className={imageIndex === index ? "is-active" : ""}
          decoding="async"
        />
      ))}
      <div className="experiences-results-shade" />
      <div className="experiences-results-counter">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <i />
        <span>{String(images.length).padStart(2, "0")}</span>
      </div>
    </div>,
    host,
  );
}
