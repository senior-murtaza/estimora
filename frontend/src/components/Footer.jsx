
  import { Link, NavLink } from "react-router-dom";

  const footerLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/catalogue", label: "Catalogue" },
    { to: "/estimate-builder", label: "Estimate Builder" },
    { to: "/management", label: "Management" },
    { to: "/contact", label: "Contact" },
  ];

  export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              Estimora<span>.</span>
            </Link>

            <p>
              Plan your project. Price it with confidence.
              <br />
              Turn project ideas into clear, organized estimates.
            </p>

            <span className="footer-status">
              <span aria-hidden="true" />
              Built for learning and project planning
            </span>
          </div>

          <div className="footer-navigation">
            <h2>Explore</h2>

            <nav aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="footer-about">
            <h2>Our Purpose</h2>
            <p>
              Estimora is a learning project for exploring freelance services,
              estimating working hours, calculating sample costs, and preparing
              proposal previews.
            </p>

            <Link to="/estimate-builder" className="footer-action">
              Create an Estimate <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Estimora. Educational project.</p>

          <Link to="/" className="footer-back-top">
            Back to Home <span aria-hidden="true">↑</span>
          </Link>
        </div>
      </footer>
    );
  }
