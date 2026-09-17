import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function FaqPunctuationGuard() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    document.querySelectorAll<HTMLElement>(".faq-section summary").forEach((summary) => {
      summary.childNodes.forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent) return;
        const next = node.textContent.replace(/\s+\?/g, "\u00A0?");
        if (next !== node.textContent) node.textContent = next;
      });
    });
  }, [pathname]);

  return null;
}
