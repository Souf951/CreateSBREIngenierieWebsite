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
    ])
      expect(document.querySelector(`a[href="/projet/${slug}"]`)).toBeTruthy();
  });
  it("uses the secure direct-send contact flow and fails safely before configuration", () => {
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
      screen.getByRole("button", { name: /Envoyer ma demande/ }),
    );

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain(
      "Le formulaire n’est pas encore relié au service d’envoi",
    );
    expect((screen.getByLabelText("Votre nom") as HTMLInputElement).value).toBe(
      "Test & Partenaire",
    );
    expect((screen.getByLabelText("Votre e-mail") as HTMLInputElement).value).toBe(
      "test@example.com",
    );
    expect((screen.getByLabelText("Votre projet") as HTMLTextAreaElement).value).toBe(
      "Rénovation à Genève\nBudget : 100 000 CHF ?",
    );
  });
  it("renders a lightweight image without a WebGL canvas on mobile", () => {
    render(<Architecture />);
    expect(screen.getByRole("img")).toBeTruthy();
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
  it("identifies provisional portraits without implying real employees", () => {
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
  it("skips the introduction when reduced motion or mobile is preferred", () => {
    const done = vi.fn();
    render(<IntroLoader onComplete={done} />);
    expect(done).toHaveBeenCalledOnce();
  });
  it("finishes the desktop intro and cancels timers on unmount", () => {
    vi.useFakeTimers();
    vi.mocked(window.matchMedia).mockImplementationOnce(
      (q) =>
        ({
          matches: false,
          media: q,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const done = vi.fn();
    const { unmount } = render(<IntroLoader onComplete={done} />);
    act(() => vi.advanceTimersByTime(2700));
    expect(done).toHaveBeenCalledOnce();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("still renders the site if session storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Chaque détail/ }),
    ).toBeTruthy();
  });
});
