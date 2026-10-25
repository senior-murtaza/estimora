
import { useEffect, useState } from "react";

export default function Catalogue() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services"
        );

        if (!response.ok) {
          throw new Error("Failed to load services.");
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError("Could not load services. Please check that the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || service.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="catalogue-page">
      <section className="catalogue-intro">
        <h1>Explore Our Services</h1>
        <p>
          Browse freelance services, compare hourly rates, and find the right
          services for your project.
        </p>
      </section>

      <div className="catalogue-controls">
        <label>
          Services
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or description"
          />
        </label>

        <label>
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
      </div>

      <section className="catalogue-services">
        {loading && <p>Loading services...</p>}

        {!loading && error && <p role="alert">{error}</p>}

        {!loading && !error && filteredServices.map((service) => (
          <article className="catalogue-card" key={service.id}>
            <h2>{service.title}</h2>
            <p>Category: {service.category}</p>
            <p>{service.description}</p>
            <p>Hourly Rate: {service.hourlyRateAFN} AFN</p>
          </article>
        ))}

        {!loading && !error && filteredServices.length === 0 && (
          <p>No services match your search.</p>
        )}
      </section>
    </main>
  );
}
