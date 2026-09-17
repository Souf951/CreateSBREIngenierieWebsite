import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import PartnersPage from "../src/app/components/PartnersPage";
import PartnerScrollStory from "../src/app/components/premium/PartnerScrollStory";
import { stageOpacity } from "../src/app/components/premium/partnerStory";

class Resize {
  observe() {}
  disconnect() {}
}

describe("Partner collaboration", () => {
  it("renders all five chapters on the server without browser APIs", () => {
    const html = renderToString(<PartnerScrollStory />);
    for (const title of [
      "Concevoir.",
      "Exécuter.",
      "Décider.",
      "Coordonner.",
      "Un projet. Une coordination.",
    ])
      expect(html).toContain(title);
    expect(html).not.toContain("is-scrub");
    expect(html).not.toContain('aria-hidden="true" class="pr-story-panel');
  });

  it("crossfades continuously in both scroll directions", () => {
    for (let i = 0; i < 4; i++) {
      const middle = (i + 0.5) / 4;
      expect(stageOpacity(middle, i)).toBeCloseTo(0.5);
      expect(stageOpacity(middle, i + 1)).toBeCloseTo(0.5);
      expect(stageOpacity(middle + 0.001, i)).toBeLessThan(
        stageOpacity(middle - 0.001, i),
      );
    }
    expect(stageOpacity(0, 0)).toBe(1);
    expect(stageOpacity(1, 4)).toBe(1);
  });

  it("keeps in-page links on the route and preselects the partner's profile", () => {
    vi.stubGlobal("ResizeObserver", Resize);
    render(
      <MemoryRouter initialEntries={["/partenaires"]}>
        <PartnersPage />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getAllByRole("link", {
        name: /Échanger sur une collaboration/,
      })[2],
    );
    expect(
      (screen.getByLabelText("Vous êtes") as HTMLSelectElement).value,
    ).toBe("Maîtres d’ouvrage");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Coordonner." })).toBeTruthy();
  });

  it("prepares the full email and invalidates it when the profile changes", () => {
    vi.stubGlobal("ResizeObserver", Resize);
    render(
      <MemoryRouter>
        <PartnersPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText("Nom / prénom *"), {
      target: { value: "René & Associés" },
    });
    fireEvent.change(screen.getByLabelText("Votre message *"), {
      target: { value: "Façade\nDétails & planning ?" },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /Préparer ma candidature/ })
        .closest("form")!,
    );
    const href = screen
      .getByRole("link", { name: /Ouvrir ma candidature/ })
      .getAttribute("href")!;
    expect(new URL(href).searchParams.get("body")).toContain("René & Associés");
    expect(new URL(href).searchParams.get("body")).toContain(
      "Façade\nDétails & planning ?",
    );
    fireEvent.change(screen.getByLabelText("Vous êtes"), {
      target: { value: "Entreprises" },
    });
    expect(
      screen.queryByRole("link", { name: /Ouvrir ma candidature/ }),
    ).toBeNull();
  });
});
