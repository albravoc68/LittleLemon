import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { ROUTER_FUTURE } from "./routerConfig";

const renderApp = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]} future={ROUTER_FUTURE}>
      <App />
    </MemoryRouter>
  );

test("home page presents the restaurant, specials, testimonials and story", () => {
  renderApp();
  expect(screen.getByRole("heading", { level: 1, name: "Little Lemon" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 2, name: /chef's specials/i })).toBeInTheDocument();
  expect(screen.getAllByRole("article").length).toBeGreaterThanOrEqual(7);
  expect(screen.getByRole("heading", { level: 2, name: /our story/i })).toBeInTheDocument();
});

test("every image has a text alternative", () => {
  renderApp();
  screen.getAllByRole("img").forEach((image) => {
    expect(image).toHaveAccessibleName();
  });
});

test("testimonial ratings are exposed as text for screen readers", () => {
  renderApp();
  expect(screen.getAllByRole("img", { name: /rated 5 out of 5 stars/i }).length).toBeGreaterThan(0);
});

test("provides a skip link and labelled landmarks", () => {
  renderApp();
  expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute("href", "#main-content");
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /footer navigation/i })).toBeInTheDocument();
});

test("navigates to the reservation page and marks it as current", async () => {
  const user = userEvent.setup();
  renderApp();
  const mainNav = screen.getByRole("navigation", { name: /main navigation/i });
  await user.click(within(mainNav).getByRole("link", { name: "Reservations" }));
  expect(screen.getByRole("heading", { level: 1, name: /reserve a table/i })).toBeInTheDocument();
  expect(within(mainNav).getByRole("link", { name: "Reservations" })).toHaveAttribute("aria-current", "page");
  expect(document.title).toMatch(/^Reservations \| Little Lemon/);
});

test("shows a not found page for unknown addresses", () => {
  renderApp("/does-not-exist");
  expect(screen.getByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
});

test("the mobile menu button toggles the navigation links", async () => {
  const user = userEvent.setup();
  renderApp();
  const toggle = screen.getByRole("button", { name: "Navigation" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  await user.keyboard("{Escape}");
  expect(toggle).toHaveAttribute("aria-expanded", "false");
});
