import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/services";

const emptyForm = {
  title: "",
  category: "",
  hourlyRate: "",
  description: "",
  offered: true,
};

// IMPORTANT: Keep this component outside Management.
// This prevents inputs from losing focus when state changes.
function ServiceFields({ values, formType, handleChange }) {
  return (
    <>
      <label htmlFor={`${formType}-title`}>Service Title</label>
      <input
        id={`${formType}-title`}
        name="title"
        type="text"
        value={values.title}
        onChange={(event) => handleChange(event, formType)}
        placeholder="e.g. Website Development"
        required
      />

      <label htmlFor={`${formType}-category`}>Category</label>
      <select
        id={`${formType}-category`}
        name="category"
        value={values.category}
        onChange={(event) => handleChange(event, formType)}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        <option value="development">Development</option>
        <option value="design">Design</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <label htmlFor={`${formType}-rate`}>Hourly Rate (AFN)</label>
      <input
        id={`${formType}-rate`}
        name="hourlyRate"
        type="number"
        min="0.01"
        step="any"
        value={values.hourlyRate}
        onChange={(event) => handleChange(event, formType)}
        placeholder="800"
        required
      />

      <label htmlFor={`${formType}-description`}>
        Service Description
      </label>
      <textarea
        id={`${formType}-description`}
        name="description"
        value={values.description}
        onChange={(event) => handleChange(event, formType)}
        placeholder="Describe what this service includes..."
        rows={4}
        required
      />

      <label htmlFor={`${formType}-offered`}>Currently Offered</label>
      <input
        id={`${formType}-offered`}
        name="offered"
        type="checkbox"
        checked={values.offered}
        onChange={(event) => handleChange(event, formType)}
      />
    </>
  );
}

export default function Management() {
  const [services, setServices] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [addValues, setAddValues] = useState({ ...emptyForm });
  const [editValues, setEditValues] = useState({ ...emptyForm });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load services from the backend
  async function loadServices() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load services.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned invalid service data.");
      }

      setServices(data);
    } catch {
      setError(
        "Could not load services. Check that the backend and database are running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // Open Add panel
  function openAddForm() {
    setAddValues({ ...emptyForm });
    setShowEditForm(false);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowAddForm(true);
  }

  // Open Edit panel
  function openEditForm(service) {
    setEditValues({
      title: service.title ?? "",
      category: service.category ?? "",
      hourlyRate: String(service.hourlyRateAFN ?? ""),
      description: service.description ?? "",
      offered: service.offered ?? true,
    });

    setEditingId(service.id);
    setShowAddForm(false);
    setError("");
    setMessage("");
    setShowEditForm(true);
  }

  // Handle changes in Add and Edit forms
  function handleChange(event, formType) {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    if (formType === "add") {
      setAddValues((previous) => ({
        ...previous,
        [name]: newValue,
      }));
    } else {
      setEditValues((previous) => ({
        ...previous,
        [name]: newValue,
      }));
    }
  }

  // Validate and prepare service data
  function prepareService(values) {
    const title = values.title.trim();
    const category = values.category;
    const hourlyRateAFN = Number(values.hourlyRate);
    const description = values.description.trim();

    if (!title) {
      throw new Error("Please enter a service title.");
    }

    if (!["development", "design", "maintenance"].includes(category)) {
      throw new Error("Please select a valid service category.");
    }

    if (
      values.hourlyRate === "" ||
      !Number.isFinite(hourlyRateAFN) ||
      hourlyRateAFN <= 0
    ) {
      throw new Error("Hourly rate must be greater than zero.");
    }

    if (!description) {
      throw new Error("Please enter a service description.");
    }

    return {
      title,
      category,
      hourlyRateAFN,
      description,
      offered: values.offered,
    };
  }

  // Add a new service
  async function handleAddSubmit(event) {
    event.preventDefault();

    let serviceData;

    try {
      serviceData = prepareService(addValues);
    } catch (err) {
      setError(err.message);
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not add service.");
      }

      setServices((previous) => [...previous, result]);
      setShowAddForm(false);
      setAddValues({ ...emptyForm });
      setMessage("Service added successfully.");
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  }

  // Update an existing service
  async function handleEditSubmit(event) {
    event.preventDefault();

    if (editingId === null) {
      setError("Please select a service to edit.");
      return;
    }

    let serviceData;

    try {
      serviceData = prepareService(editValues);
    } catch (err) {
      setError(err.message);
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update service.");
      }

      setServices((previous) =>
        previous.map((service) =>
          service.id === editingId ? result : service
        )
      );

      setShowEditForm(false);
      setEditingId(null);
      setEditValues({ ...emptyForm });
      setMessage("Service updated successfully.");
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  }

  // Delete a service
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete service.");
      }

      setServices((previous) =>
        previous.filter((service) => service.id !== id)
      );

      if (editingId === id) {
        setShowEditForm(false);
        setEditingId(null);
        setEditValues({ ...emptyForm });
      }

      setMessage("Service deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    }
  }

  // Close Add panel
  function closeAddForm() {
    setShowAddForm(false);
    setAddValues({ ...emptyForm });
    setError("");
  }

  // Close Edit panel
  function closeEditForm() {
    setShowEditForm(false);
    setEditingId(null);
    setEditValues({ ...emptyForm });
    setError("");
  }

  // Service statistics
  const myStatistics = [
    {
      id: 1,
      title: "Total Services",
      value: services.length,
      description: "All services in your catalogue.",
    },
    {
      id: 2,
      title: "Offered Services",
      value: services.filter((service) => service.offered).length,
      description: "Services currently available.",
    },
    {
      id: 3,
      title: "Unavailable",
      value: services.filter((service) => !service.offered).length,
      description: "Services not currently offered.",
    },
  ];

  return (
    <main className="management">
      <section className="management-intro">
        <h1>Manage Your Services</h1>
        <p>
          Manage your freelance services, update hourly rates, and keep your
          service catalogue organized.
        </p>

        <button type="button" onClick={openAddForm}>
          Add New Service
        </button>
      </section>

      {error && (
        <p className="management-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="management-message" role="status">
          {message}
        </p>
      )}

      {/* Add service panel */}
      {showAddForm && (
        <section className="service-form-section add-service-panel">
          <h2>Add a New Service</h2>
          <p>Enter the details for your new freelance service.</p>

          <form onSubmit={handleAddSubmit}>
            <ServiceFields
              values={addValues}
              formType="add"
              handleChange={handleChange}
            />

            <div className="management-form-actions">
              <button
                type="button"
                disabled={saving}
                onClick={closeAddForm}
              >
                Cancel
              </button>

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Service"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Edit service panel */}
      {showEditForm && (
        <section className="service-form-section edit-service-panel">
          <div className="edit-panel-header">
            <div className="edit-panel-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
              </svg>
            </div>

            <div className="edit-panel-heading">
              <span className="edit-panel-eyebrow">
                SERVICE CONFIGURATION
              </span>
              <h2>Edit Service</h2>
              <p>
                Update your service details, pricing, and availability.
              </p>
            </div>

            <button
              className="edit-panel-close"
              type="button"
              onClick={closeEditForm}
              disabled={saving}
              aria-label="Close edit panel"
            >
              &times;
            </button>
          </div>

          <div className="edit-selected-service">
            <span className="edit-selected-label">CURRENTLY EDITING</span>
            <strong>{editValues.title || "Untitled service"}</strong>
            <span className="edit-selected-category">
              {editValues.category || "No category selected"}
            </span>
          </div>

          <form className="edit-service-form" onSubmit={handleEditSubmit}>
            <div className="edit-form-section-title">
              <span>01</span>
              <div>
                <h3>Service information</h3>
                <p>Keep the title and description clear.</p>
              </div>
            </div>

            <div className="edit-form-grid">
              <div className="edit-field edit-field-full">
                <label htmlFor="edit-title">Service Title</label>
                <input
                  id="edit-title"
                  name="title"
                  value={editValues.title}
                  onChange={(event) => handleChange(event, "edit")}
                  placeholder="e.g. Website Development"
                  required
                />
              </div>

              <div className="edit-field">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  name="category"
                  value={editValues.category}
                  onChange={(event) => handleChange(event, "edit")}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="edit-field">
                <label htmlFor="edit-rate">Hourly Rate</label>
                <div className="edit-rate-input">
                  <input
                    id="edit-rate"
                    name="hourlyRate"
                    type="number"
                    min="0.01"
                    step="any"
                    value={editValues.hourlyRate}
                    onChange={(event) => handleChange(event, "edit")}
                    placeholder="800"
                    required
                  />
                  <span>AFN / hr</span>
                </div>
              </div>

              <div className="edit-field edit-field-full">
                <label htmlFor="edit-description">
                  Service Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editValues.description}
                  onChange={(event) => handleChange(event, "edit")}
                  placeholder="Describe what this service includes..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="edit-availability-row">
              <div className="edit-availability-copy">
                <strong>Service availability</strong>
                <p>
                  {editValues.offered
                    ? "Clients can currently select this service."
                    : "This service is currently unavailable to clients."}
                </p>
              </div>

              <label className="edit-toggle">
                <input
                  name="offered"
                  type="checkbox"
                  checked={editValues.offered}
                  onChange={(event) => handleChange(event, "edit")}
                />
                <span className="edit-toggle-track" />
                <span className="edit-toggle-text">
                  {editValues.offered ? "Offered" : "Unavailable"}
                </span>
              </label>
            </div>

            <div className="edit-form-footer">
              <span className="edit-footer-note">
                Changes apply after you save.
              </span>

              <div className="management-form-actions">
                <button
                  className="edit-cancel-button"
                  type="button"
                  disabled={saving}
                  onClick={closeEditForm}
                >
                  Cancel
                </button>

                <button
                  className="edit-save-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving changes..." : "Save Changes"}
                  {!saving && <span aria-hidden="true"> →</span>}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Statistics */}
      <section
        className="management-statistics"
        aria-label="Service statistics"
      >
        {myStatistics.map((item) => (
          <article className="management-cards" key={item.id}>
            <h2>{item.title}</h2>
            <span>{item.value}</span>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      {/* Service list */}
      <section className="management-service-list">
        <h2>Your Services</h2>

        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p>No services have been added yet.</p>
        ) : (
          <div className="management-services-grid">
            {services.map((service) => (
              <article
                key={service.id}
                className="management-cards service-card"
              >
                <h3>{service.title}</h3>
                <p>Category: {service.category}</p>
                <p>Hourly Rate: {service.hourlyRateAFN} AFN</p>
                <p>{service.description}</p>
                <p>
                  Status: {service.offered ? "Offered" : "Unavailable"}
                </p>

                <div className="management-card-actions">
                  <button
                    type="button"
                    onClick={() => openEditForm(service)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
