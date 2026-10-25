import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Catalogue from "./Pages/Catalogue.jsx";
import Contact from "./Pages/Contact.jsx";
import Management from "./Pages/Management.jsx";
import NotFound from "./Pages/NotFound.jsx";
import Workflow from "./Pages/Workflow.jsx";
// Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import EstimateBuilder from "./Pages/EstimateBuilder.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/estimate-builder" element={<EstimateBuilder />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="about" element={<About />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="contact" element={<Contact />} />
        <Route path="workflow" element={<Workflow />} />
        <Route path="management" element={<Management />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
);
