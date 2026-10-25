
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB schemas
const serviceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["development", "design", "maintenance"],
  },
  hourlyRateAFN: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, trim: true },
  offered: { type: Boolean, required: true },
});

const messageSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Service = mongoose.model("Service", serviceSchema);
const ContactMessage = mongoose.model("ContactMessage", messageSchema);

const categories = ["development", "design", "maintenance"];

const initialServices = [
  {
    id: 1,
    title: "Website Development",
    category: "development",
    hourlyRateAFN: 800,
    offered: true,
    description: "Build a responsive website for a business or personal brand.",
  },
  {
    id: 2,
    title: "UI/UX Design",
    category: "design",
    hourlyRateAFN: 500,
    offered: true,
    description: "Design clear and user-friendly interfaces.",
  },
  {
    id: 3,
    title: "Website Maintenance",
    category: "maintenance",
    hourlyRateAFN: 300,
    offered: true,
    description: "Update content and maintain an existing website.",
  },
];

function validateService(body) {
  const { title, category, hourlyRateAFN, description, offered } = body ?? {};

  return (
    typeof title === "string" &&
    !!title.trim() &&
    categories.includes(category) &&
    typeof hourlyRateAFN === "number" &&
    Number.isFinite(hourlyRateAFN) &&
    hourlyRateAFN > 0 &&
    typeof description === "string" &&
    !!description.trim() &&
    typeof offered === "boolean"
  );
}

function validateMessage(body) {
  const { firstName, lastName, email, subject, message } = body ?? {};

  if (
    typeof firstName !== "string" || !firstName.trim() ||
    typeof lastName !== "string" || !lastName.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof subject !== "string" || !subject.trim() ||
    typeof message !== "string" || !message.trim()
  ) {
    return "Please fill in all fields.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  return null;
}

// Health-check route
app.get("/", (req, res) => {
  res.send("Estimora backend is running!");
});

// Get all services
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ id: 1 }).lean();
    res.json(services);
  } catch (error) {
    console.error("Get services failed:", error.message);
    res.status(500).json({ message: "Could not load services." });
  }
});

// Add a service
app.post("/api/services", async (req, res) => {
  try {
    if (!validateService(req.body)) {
      return res.status(400).json({
        message: "Invalid service information.",
      });
    }

    const lastService = await Service.findOne().sort({ id: -1 }).lean();
    const id = lastService ? lastService.id + 1 : 1;

    const service = await Service.create({
      id,
      title: req.body.title.trim(),
      category: req.body.category,
      hourlyRateAFN: req.body.hourlyRateAFN,
      description: req.body.description.trim(),
      offered: req.body.offered,
    });

    res.status(201).json(service.toObject());
  } catch (error) {
    console.error("Add service failed:", error.message);
    res.status(500).json({ message: "Could not add service." });
  }
});

// Update a service
app.put("/api/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid service ID." });
    }

    if (!validateService(req.body)) {
      return res.status(400).json({
        message: "Invalid service information.",
      });
    }

    const service = await Service.findOneAndUpdate(
      { id },
      {
        title: req.body.title.trim(),
        category: req.body.category,
        hourlyRateAFN: req.body.hourlyRateAFN,
        description: req.body.description.trim(),
        offered: req.body.offered,
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.json(service.toObject());
  } catch (error) {
    console.error("Update service failed:", error.message);
    res.status(500).json({ message: "Could not update service." });
  }
});

// Delete a service
app.delete("/api/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid service ID." });
    }

    const service = await Service.findOneAndDelete({ id });

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Delete service failed:", error.message);
    res.status(500).json({ message: "Could not delete service." });
  }
});

// Receive and persist contact messages
app.post("/api/messages", async (req, res) => {
  try {
    const validationError = validateMessage(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { firstName, lastName, email, subject, message } = req.body;

    const savedMessage = await ContactMessage.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      message: "Your message has been received successfully.",
      contactMessage: {
        id: savedMessage._id,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Save contact message failed:", error.message);
    res.status(500).json({
      message: "Could not save your message. Please try again.",
    });
  }
});

// Seed the initial services only if the collection is empty
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const serviceCount = await Service.countDocuments();

    if (serviceCount === 0) {
      await Service.insertMany(initialServices);
      console.log("Initial services added to MongoDB.");
    }

    app.listen(PORT, () => {
      console.log(`Estimora backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
