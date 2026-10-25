import { useState } from "react";

const API_URL = "http://localhost:5000/api/messages";

export default function Contact() {
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const messageData = Object.fromEntries(formData.entries());

    setSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not send your message.");
      }

      alert(result.message);
      form.reset();
    } catch (error) {
      alert(
        error.message === "Failed to fetch"
          ? "Could not connect to the server. Please try again."
          : error.message || "Could not send your message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="contact-page">
      <section>
        <h2>Talk to the Estimora Team</h2>
        <p>
          Have questions about Estimora? Want to make an estimate?
          Our team is here to help you with your project estimates.
        </p>
      </section>

      <section>
        <h3>Contact Information</h3>

        <div>
          <ul>
            <li>
              <strong>Email us</strong>
              <span>contact@estimora.tech</span>
              <span>Direct response within hours</span>
            </li>

            <li>
              <strong>Call us</strong>
              <span>+780000001</span>
              <span>Murtaza Rahimi</span>
            </li>

            <li>
              <strong>Our Instagram</strong>
              <span>estimora.src</span>
              <span>Follow us</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <form onSubmit={handleSubmit}>
          <h3>Send us a message</h3>
          <p>
            Fill out the form below and we will get back to you promptly.
          </p>

          <div className="name">
            <label htmlFor="contact-first-name">
              First Name
              <input
                id="contact-first-name"
                required
                name="firstName"
                type="text"
                maxLength={80}
                placeholder="First name"
              />
            </label>

            <label htmlFor="contact-last-name">
              Last Name
              <input
                id="contact-last-name"
                required
                name="lastName"
                type="text"
                maxLength={80}
                placeholder="Last name"
              />
            </label>
          </div>

          <label htmlFor="contact-email">
            Email
            <input
              id="contact-email"
              required
              name="email"
              type="email"
              maxLength={254}
              placeholder="you@example.com"
            />
          </label>

          <label htmlFor="contact-subject">
            Subject
            <input
              id="contact-subject"
              required
              name="subject"
              type="text"
              maxLength={150}
              placeholder="How can we help?"
            />
          </label>

          <label htmlFor="contact-message">
            Your Message
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={5}
              placeholder="Write your message here..."
            />
          </label>

          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
}