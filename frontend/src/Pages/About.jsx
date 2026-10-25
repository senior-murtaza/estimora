import { NavLink } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Explore Services",
    description:
      "Browse development, design, and maintenance services with descriptions and practice hourly rates.",
    icon: "⌘",
  },
  {
    number: "02",
    title: "Build an Estimate",
    description:
      "Choose the services you need, set the estimated hours, and see your project costs calculated.",
    icon: "↗",
  },
  {
    number: "03",
    title: "Plan Your Budget",
    description:
      "Apply a sample discount, calculate a deposit, and review the estimated project total.",
    icon: "◈",
  },
  {
    number: "04",
    title: "Prepare a Proposal",
    description:
      "Add client details and a project brief to create a clear, organized estimate preview.",
    icon: "▤",
  },
];


export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <span className="about-eyebrow">ABOUT ESTIMORA</span>

        <h1>
          Better planning.
          <br />
          <span>Clearer estimates.</span>
        </h1>

        <p>
          Estimora is a freelance project estimate planner designed to help
          junior developers and designers organize services, estimate project
          costs, and prepare sample proposals with confidence.
        </p>

        <NavLink to="/estimate-builder" className="about-cta">
          Start Building an Estimate
          <span aria-hidden="true">→</span>
        </NavLink>

        <div className="about-orbit orbit-one" aria-hidden="true" />
        <div className="about-orbit orbit-two" aria-hidden="true" />
      </section>

      <section className="about-purpose">
        <div className="about-section-heading">
          <span className="about-eyebrow">OUR PURPOSE</span>
          <h2>From project idea to cost estimate.</h2>
          <p>
            Planning a freelance project involves more than choosing a price.
            You need to understand the work, estimate the time, and communicate
            the expected costs clearly.
          </p>
        </div>

        <div className="about-feature-grid">
          {features.map((feature) => (
            <article className="about-feature-card" key={feature.number}>
              <div className="about-feature-top">
                <span className="about-feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <span className="about-feature-number">{feature.number}</span>
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-note">
        <div>
          <span className="about-eyebrow">BUILT FOR LEARNING</span>
          <h2>A practical way to learn project estimation.</h2>
          <p>
            Estimora uses practice rates and sample project information.
            Its purpose is to demonstrate how services, working hours,
            discounts, and deposits can be organized into a project estimate.
            The displayed figures are examples, not guaranteed market prices.
          </p>
        </div>

        <NavLink to="/catalogue" className="about-text-link">
          Explore the catalogue <span aria-hidden="true">→</span>
        </NavLink>
      </section>
    </main>
  );
}
