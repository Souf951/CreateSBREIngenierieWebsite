import { useEffect } from "react";
/** Content stays visible when JavaScript, observer support or motion is unavailable. */
export function useReveal() {
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const nodes = [
      ...document.querySelectorAll<HTMLElement>(
        ".section-heading,.expertise-card,.project-card",
      ),
    ];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top > window.innerHeight) {
        node.classList.add("will-reveal");
        observer.observe(node);
      }
    });
    return () => {
      observer.disconnect();
      nodes.forEach((node) => node.classList.remove("will-reveal"));
    };
  }, []);
}
