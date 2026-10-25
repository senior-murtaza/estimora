import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/catalogue", label: "Catalogue" },
  {to: "/estimate-builder", label: "EstimateBuilder"},
  { to: "/workflow", label: "Workflow" },
  { to: "/management", label: "Management" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <NavLink to="/" className="brand-link" onClick={closeMenu}>
        Estimora
      </NavLink>

      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`menu-icon ${menuOpen ? "is-open" : ""}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id="main-navigation"
        className={`nav-links ${menuOpen ? "menu-open" : ""}`}
        aria-label="Main navigation"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
