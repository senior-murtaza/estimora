export default function Workflow() {
  return (
    <div className="workflow-page">
      <section className="workflow-intro">
        <h1>How Estimora works</h1>
        <p>
          Create a clear project estimate in four simple steps. Choose your
          services, calculate your costs, and prepare a professional proposal.
        </p>

        <section className="workflow-steps">
          <article className="workflow-card">
            <span className="workflow-number">01</span>
            <h2>Explore Services</h2>
            <p>
              Browse available freelance services and compare their hourly rates
              to find what your project needs.
            </p>
          </article>

          <article className="workflow-card">
            <span className="workflow-number">02</span>
            <h2>Plan Hours</h2>
            <p>
              Select the services you need and enter the estimated working hours
              for each service.
            </p>
          </article>

          <article className="workflow-card">
            <span className="workflow-number">03</span>
            <h2>Calculate Costs</h2>
            <p>
              Calculate your project subtotal and adjust the discount and
              deposit percentages.
            </p>
          </article>

          <article className="workflow-card">
            <span className="workflow-number">04</span>
            <h2>Review Your Estimate</h2>
            <p>
              Review the final estimated cost and prepare a clear
            sample proposal for your client.
            </p>
          </article>
        </section>
      </section>
    </div>
  );
}
