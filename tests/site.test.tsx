import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../src/app/components/HomePage";
import ContactForm from "../src/app/components/premium/ContactForm";
import Architecture from "../src/app/components/premium/Architecture";
import IntroLoader from "../src/app/components/IntroLoader";
import App from "../src/app/App";

const home = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

describe("Visitor journeys", () => {
  it("opens and closes the mobile navigation when a destination is chosen", () => {
    home();
    fireEvent.click(screen.getByRole("button", { name: "Menu ☰" }));
    const nav = screen.getByRole("navigation", { name: "Navigation mobile" });
    expect(nav).toBeTruthy();
    fireEvent.click(nav.querySelectorAll("button")[0]);
    expect(
      screen.queryByRole("navigation", { name: "Navigation mobile" }),
    ).toBeNull();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("switches the situation and presents the associated actions", () => {
    home();
    fireEvent.click(
      screen.getByRole("button", { name: /Délais & anticipation/ }),
    );
    expect(
      screen.getByRole("heading", {
        name: "Un planning doit permettre de décider.",
      }),
    ).toBeTruthy();
    expect(screen.getByText(/Reséquencer les tâches/)).toBeTruthy();
    expect(screen.getByText(/résultats clients attestés/)).toBeTruthy();
  });

  it("keeps the three original project links", () => {
    home();
    for (const slug of [
      "tertiaire-geneve",
      "micro-logements-lancy",
      "villa-prangins",
    ]) {
      expect(document.querySelector(`a[href="/projet/${slug}"]`)).toBeTruthy();
    }
  });

  it("preserves names, special characters and the complete message in the email draft", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Votre nom"), {
      target: { value: "Test & Partenaire" },
    });
    fireEvent.change(screen.getByLabelText("Votre e-mail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Votre projet"), {
      target: { value: "Rénovation à Genève\nBudget : 100 000 CHF ?" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Préparer mon e-mail/ }),
    );
    const href = screen
      .getByRole("link", { name: /Ouvrir mon brouillon/ })
      .getAttribute("href")!;
    const body = new URL(href).searchParams.get("body");
    expect(body).toContain("Test & Partenaire");
    expect(body).toContain("test@example.com");
    expect(body).toContain("Rénovation à Genève\nBudget : 100 000 CHF ?");
    fireEvent.change(screen.getByLabelText("Votre nom"), {
      target: { value: "Correction" },
    });
    expect(
      screen.queryByRole("link", { name: /Ouvrir mon brouillon/ }),
    ).toBeNull();
  });

  it("uses a lightweight fallback when motion or WebGL is unavailable", () => {
    render(<Architecture />);
    expect(document.querySelector(".architecture-static-placeholder")).toBeTruthy();
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("allows the construction phase to be selected with semantic buttons", () => {
    home();
    const button = screen.getByRole("button", { name: "01 Fondations" });
    fireEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen
        .getByRole("button", { name: "04 Finitions" })
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("identifies provisional portraits without implying real employees in the base markup", () => {
    home();
    expect(
      screen.getAllByText("Profil provisoire · illustration IA"),
    ).toHaveLength(2);
    expect(
      screen.getByRole("img", {
        name: "Soufiane, directeur de SBRE Ingénierie",
      }),
    ).toBeTruthy();
  });

  it("lets the visitor skip the introduction", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<IntroLoader onComplete={done} />);
    fireEvent.click(screen.getByRole("button", { name: "Passer l'animation" }));
    act(() => vi.advanceTimersByTime(900));
    expect(done).toHaveBeenCalledOnce();
  });

  it("finishes the full desktop intro and cancels timers on unmount", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const { unmount } = render(<IntroLoader onComplete={done} />);
    act(() => vi.advanceTimersByTime(5400));
    expect(done).toHaveBeenCalledOnce();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("remains usable if session storage is unavailable", () => {
    vi.useFakeTimers();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Passer l'animation" }));
    act(() => vi.advanceTimersByTime(900));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Direction de travaux et pilotage de chantier/i,
      }),
    ).toBeTruthy();
  });
});
