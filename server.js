const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const partnersFile = path.join(__dirname, "partners.json");
const servicesFile = path.join(__dirname, "services.json");

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// API: Get partners
app.get("/api/partners", (req, res) => {
  try {
    const data = fs.readFileSync(partnersFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading partners.json:", err);
    res.status(500).json({ error: "Failed to read partners" });
  }
});

// API: Get services
app.get("/api/services", (req, res) => {
  try {
    const data = fs.readFileSync(servicesFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading services.json:", err);
    res.status(500).json({ error: "Failed to read services" });
  }
});

// API: Add new service
app.post("/api/services", (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFile, "utf8"));
    const newService = req.body;
    // Assign new id
    const maxId = services.length > 0 ? Math.max(...services.map(s => s.id)) : 0;
    newService.id = maxId + 1;
    services.push(newService);
    fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2), "utf8");
    res.status(201).json(newService);
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ error: "Failed to add service" });
  }
});

// API: Update service
app.put("/api/services/:id", (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Service not found" });
    }
    services[index] = { ...services[index], ...req.body };
    fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2), "utf8");
    res.json(services[index]);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// API: Delete service
app.delete("/api/services/:id", (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Service not found" });
    }
    const deletedService = services.splice(index, 1)[0];
    fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2), "utf8");
    res.json(deletedService);
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// API: Update partners order
app.post("/api/partners", (req, res) => {
  try {
    const { partners } = req.body;
    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: "Partners must be an array" });
    }

    // Write updated partners to file
    fs.writeFileSync(
      partnersFile,
      JSON.stringify({ partners }, null, 2),
      "utf8",
    );
    console.log("✓ Partners saved successfully");
    res.json({ success: true, message: "Partners updated successfully" });
  } catch (err) {
    console.error("Error saving partners.json:", err);
    res.status(500).json({ error: "Failed to save partners" });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 DevSym Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`\nPartners editing is now enabled!`);
  console.log(
    `Open http://localhost:${PORT}/projet.html and click "✏️ Éditer l'ordre"\n`,
  );
});
