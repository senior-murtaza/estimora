import benefits from "../data/Benefits";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-content">
      <section className="first-section">
        <h1>Plan your project. Price it with confidence.</h1>
        <p>
          Turn your project requirements into clear cost estimates and
          professional proposals.
        </p>

        <NavLink to="/estimate-builder" className="primary-cta">
          Create an Estimate <span aria-hidden="true">→</span>
        </NavLink>
      </section>

      <section className="second-section">
        {benefits.map((e) => (
          <div key={e.title} className="benefit-card">
            <h2>{e.title}</h2>
            <p>{e.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
