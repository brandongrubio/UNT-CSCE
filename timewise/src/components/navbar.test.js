import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // We need Router to test the Link components
import AppNavbar from "./AppNavbar"; // Adjust the path as necessary
import "@testing-library/jest-dom";

describe("AppNavbar", () => {
  test("renders TimeWise brand", () => {
    render(
      <Router>
        <AppNavbar />
      </Router>
    );
    const brandElement = screen.getByText(/TimeWise/i);
    expect(brandElement).toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    render(
      <Router>
        <AppNavbar />
      </Router>
    );
    const navLinks = [
      "Home",
      "Pomodoro",
      "Tasks",
      "Calendar",
      "Study Clock",
      "Settings",
      "Profile",
      "Logout"
    ];
    navLinks.forEach((linkText) => {
      const linkElement = screen.getByText(linkText);
      expect(linkElement).toBeInTheDocument();
    });
  });

  test("navigates correctly on link click", () => {
    render(
      <Router>
        <AppNavbar />
      </Router>
    );
    fireEvent.click(screen.getByText(/Home/i));
    expect(window.location.pathname).toBe("/home");

    fireEvent.click(screen.getByText(/Pomodoro/i));
    expect(window.location.pathname).toBe("/pomodoro");

    fireEvent.click(screen.getByText(/Tasks/i));
    expect(window.location.pathname).toBe("/tasks");
  });

  test("renders the navbar toggle button", () => {
    render(
      <Router>
        <AppNavbar />
      </Router>
    );
    const toggleButton = screen.getByRole("button", { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
  });
});
