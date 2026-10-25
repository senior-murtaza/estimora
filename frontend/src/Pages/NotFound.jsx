
import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <div className="not-found-code" aria-hidden="true">
          404
        </div>

        <span className="not-found-label">PAGE NOT FOUND</span>

        <h1>Lost in the wrong direction?</h1>

        <p>
          The page you are looking for doesn't exist or may have
          been moved. Let's get you back to planning your next project.
        </p>

        <NavLink to="/" className="not-found-home-link">
          <span aria-hidden="true">←</span>
          Back to Home
        </NavLink>

        <div className="not-found-decoration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
