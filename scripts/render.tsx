import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../src/app/components/HomePage";
export function render() {
  return renderToString(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}
