import { useEffect } from "react";

export default function MethodAccordionGuard() {
  useEffect(() => {
    const details = Array.from(
      document.querySelectorAll<HTMLDetailsElement>(".method-list details"),
    );

    const cleanups = details.map((item) => {
      const onToggle = () => {
        if (!item.open) return;
        details.forEach((other) => {
          if (other !== item) other.open = false;
        });
      };

      item.addEventListener("toggle", onToggle);
      return () => item.removeEventListener("toggle", onToggle);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
