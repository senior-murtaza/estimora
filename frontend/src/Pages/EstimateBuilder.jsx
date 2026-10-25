import { useState, useMemo } from "react";
import initialServices from "../data/initialServices";

const money = (amount) =>
  `${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} AFN`;

export default function EstimateBuilder() {
  const [services] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [offeredOnly, setOfferedOnly] = useState(false);
  const [selected, setSelected] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [deposit, setDeposit] = useState(20);
  const [client, setClient] = useState({
    alias: "",
    email: "",
    brief: "",
    requestedDate: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  const filteredServices = useMemo(() => {
    const result = services.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || service.category === category;

      const matchesOffered = !offeredOnly || service.offered;

      return matchesSearch && matchesCategory && matchesOffered;
    });

    if (sort === "low") {
      result.sort((a, b) => a.hourlyRateAFN - b.hourlyRateAFN);
    } else if (sort === "high") {
      result.sort((a, b) => b.hourlyRateAFN - a.hourlyRateAFN);
    }

    return result;
  }, [services, search, category, sort, offeredOnly]);

  const subtotal = selected.reduce(
    (total, item) => total + item.hours * item.hourlyRateAFN,
    0,
  );

  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  const depositAmount = total * (deposit / 100);
  const remaining = total - depositAmount;

  function addService(service) {
      setSelected((current) => {
      if (current.some((item) => item.id === service.id)) {
        return current;
      }

      return [...current, { ...service, hours: 1 }];
    });
  }

  function updateHours(id, value) {
    if (value === "") {
      setSelected((current) =>
        current.map((item) => (item.id === id ? { ...item, hours: "" } : item)),
      );
      return;
    }

    const hours = Number(value);

    if (!Number.isInteger(hours) || hours < 1) return;

    setSelected((current) =>
      current.map((item) => (item.id === id ? { ...item, hours } : item)),
    );
  }

  function removeService(id) {
    setSelected((current) => current.filter((item) => item.id !== id));
  }

  function updateClient(event) {
    const { name, value } = event.target;

    setClient((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function generatePreview(event) {
    event.preventDefault();

    if (
      discount === "" ||
      !Number.isFinite(Number(discount)) ||
      Number(discount) < 0 ||
      Number(discount) > 20
    ) {
      alert("Discount must be between 0% and 20%.");
      return;
    }

    if (
      selected.some(
        (item) =>
          !Number.isInteger(Number(item.hours)) || Number(item.hours) < 1,
      )
    ) {
      alert("Every selected service must have at least one whole hour.");
      return;
    }

    if (deposit < 0 || deposit > 100) {
      alert("Deposit must be between 0% and 100%.");
      return;
    }

    if (!client.alias.trim() || !client.email.trim() || !client.brief.trim()) {
      alert("Please complete the client name, email, and project brief.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(client.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    setShowPreview(true);
  }

  return (
    <main className="home-content estimate-page">
      <section className="first-section">
        <h1>Build Your Estimate</h1>
        <p>
          Select services, set your project hours, and prepare a clear sample
          estimate for your client.
        </p>
      </section>

      <div className="estimate-layout">
        <section className="estimate-panel">
          <h2>Explore Services</h2>

          <label className="estimate-field">
            Search services
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by service name or description"
            />
          </label>

          <div className="estimate-filters">
            <label className="estimate-field">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>

            <label className="estimate-field">
              Sort by rate
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="default">Default order</option>
                <option value="low">Lowest first</option>
                <option value="high">Highest first</option>
              </select>
            </label>
          </div>

          <label className="estimate-checkbox">
            <input
              type="checkbox"
              checked={offeredOnly}
              onChange={(event) => setOfferedOnly(event.target.checked)}
            />
            Show only currently offered services
          </label>

          <div className="service-list">
            {filteredServices.map((service) => {
              const isSelected = selected.some(
                (item) => item.id === service.id,
              );

              return (
                <article className="estimate-service" key={service.id}>
                  <div className="service-heading">
                    <h3>{service.title}</h3>
                    <span className="service-category">{service.category}</span>
                  </div>

                  <p>{service.description}</p>

                  <p className="service-rate">
                    {money(service.hourlyRateAFN)} / hour
                  </p>

                  <p className="service-status">
                    {service.offered
                      ? "Currently offered"
                      : "Not currently offered"}
                  </p>

                  <button
                    type="button"
                    className="estimate-action"
                    onClick={() => addService(service)}
                    disabled={isSelected}
                  >
                    {isSelected ? "Added to estimate" : "Add service"}
                  </button>
                </article>
              );
            })}

            {filteredServices.length === 0 && (
              <p>No services match your search.</p>
            )}
          </div>
        </section>

        <section className="estimate-panel">
          <h2>Your Estimate</h2>

          {selected.length === 0 ? (
            <p className="estimate-empty">
              No services selected yet. Add a service to get started.
            </p>
          ) : (
            <div className="selected-services">
              {selected.map((item) => (
                <article className="selected-service" key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{money(item.hourlyRateAFN)} per hour</p>
                  </div>

                  <label className="estimate-field hours-field">
                    Hours
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.hours}
                      onChange={(event) =>
                        updateHours(item.id, event.target.value)
                      }
                    />
                  </label>

                  <p className="line-total">
                    Line total: {money(Number(item.hours) * item.hourlyRateAFN)}
                  </p>

                  <button
                    type="button"
                    className="remove-service"
                    onClick={() => removeService(item.id)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="estimate-adjustments">
            <label className="estimate-field">
              Discount (0–20%)
              <input
                type="number"
                min="0"
                max="20"
                step="1"
                value={discount}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    setDiscount("");
                  } else {
                    setDiscount(Number(value));
                  }
                }}
              />
            </label>

            <label className="estimate-field">
              Deposit (0–100%)
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={deposit}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    setDeposit("");
                  } else {
                    setDeposit(Number(value));
                  }
                }}
              />
            </label>
          </div>

          <div className="estimate-totals">
            <p>
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </p>
            <p>
              <span>Discount amount</span>
              <strong>− {money(discountAmount)}</strong>
            </p>
            <p className="estimate-grand-total">
              <span>Discounted total</span>
              <strong>{money(total)}</strong>
            </p>
            <p>
              <span>Deposit amount</span>
              <strong>{money(depositAmount)}</strong>
            </p>
            <p>
              <span>Remaining balance</span>
              <strong>{money(remaining)}</strong>
            </p>
          </div>
        </section>
      </div>

      <section className="estimate-panel client-panel">
        <h2>Client and Project Details</h2>

        <form onSubmit={generatePreview}>
          <div className="client-fields">
            <label className="estimate-field">
              Client alias
              <input
                name="alias"
                value={client.alias}
                onChange={updateClient}
                placeholder="Example: Client A"
                required
              />
            </label>

            <label className="estimate-field">
              Email
              <input
                name="email"
                type="email"
                value={client.email}
                onChange={updateClient}
                placeholder="client@example.com"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title="Please enter a valid email address, e.g. client@example.com"
                required
              />
            </label>

            <label className="estimate-field">
              Requested date
              <input
                name="requestedDate"
                type="date"
                value={client.requestedDate}
                onChange={updateClient}
              />
            </label>

            <label className="estimate-field brief-field">
              Project brief
              <textarea
                name="brief"
                value={client.brief}
                onChange={updateClient}
                placeholder="Describe the project requirements..."
                rows="4"
                required
              />
            </label>
          </div>

          <button type="submit" className="estimate-action preview-action">
            Generate Estimate Preview
          </button>
        </form>

        {showPreview && (
          <div className="estimate-preview">
            <h2>Sample Estimate Preview</h2>
            <p>
              <strong>Client:</strong> {client.alias}
            </p>
            <p>
              <strong>Email:</strong> {client.email}
            </p>
            <p>
              <strong>Requested date:</strong>{" "}
              {client.requestedDate || "Not specified"}
            </p>
            <p>
              <strong>Project brief:</strong> {client.brief}
            </p>

            <h3>Selected services</h3>
            <ul>
              {selected.map((item) => (
                <li key={item.id}>
                  {item.title} — {item.hours} hour(s) —{" "}
                  {money(Number(item.hours) * item.hourlyRateAFN)}
                </li>
              ))}
            </ul>

            <p>
              <strong>Subtotal:</strong> {money(subtotal)}
            </p>
            <p>
              <strong>Discount:</strong> {discount}% (−{money(discountAmount)})
            </p>
            <p>
              <strong>Final total:</strong> {money(total)}
            </p>
            <p>
              <strong>Sample deposit:</strong> {deposit}% (
              {money(depositAmount)})
            </p>
            <p>
              <strong>Remaining balance:</strong> {money(remaining)}
            </p>

            <p className="estimate-disclaimer">
              This is a sample estimate for planning purposes, not an invoice.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
