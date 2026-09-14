import { useEffect } from "react";
import { createPortal } from "react-dom";
import tertiaire1 from "../../../media/1721891230963.webp";
import tertiaire2 from "../../../media/1721891231094.webp";
import micro1 from "../../../media/1746172633498-2.webp";
import micro2 from "../../../media/1746172634781-2.webp";

export default function ProjectsResultsBackground() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".projects-section");
    section?.classList.add("projects-results-background");
    return () => section?.classList.remove("projects-results-background");
  }, []);

  const host = document.querySelector<HTMLElement>(".projects-section");
  if (!host) return null;

  return createPortal(
    <div className="projects-results-mosaic" aria-hidden="true">
      <img src={tertiaire1} alt="" />
      <img src={micro1} alt="" />
      <img src={tertiaire2} alt="" />
      <img src={micro2} alt="" />
      <div className="projects-results-veil" />
    </div>,
    host,
  );
}
