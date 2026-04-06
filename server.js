const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const partnersFile = path.join(__dirname, "partners.json");
const servicesFile = path.join(__dirname, "services.json");
const projetsFile = path.join(__dirname, "projets.json");
const portfolioFile = path.join(__dirname, "portfolio.json");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-");
    const timestamp = Date.now();
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

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

// API: Get projects
app.get("/api/projets", (req, res) => {
  try {
    const data = fs.readFileSync(projetsFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading projets.json:", err);
    res.status(500).json({ error: "Failed to read projets" });
  }
});

// API: Add new service
app.post("/api/services", (req, res) => {
  try {
    const services = JSON.parse(fs.readFileSync(servicesFile, "utf8"));
    const newService = req.body;
    // Assign new id
    const maxId =
      services.length > 0 ? Math.max(...services.map((s) => s.id)) : 0;
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
    const index = services.findIndex((s) => s.id === id);
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
    const index = services.findIndex((s) => s.id === id);
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

// API: Add new project
app.post("/api/projets", (req, res) => {
  try {
    const projets = JSON.parse(fs.readFileSync(projetsFile, "utf8"));
    const newProjet = req.body;
    // Assign new id
    const maxId =
      projets.length > 0 ? Math.max(...projets.map((p) => p.id)) : 0;
    newProjet.id = maxId + 1;
    projets.push(newProjet);
    fs.writeFileSync(projetsFile, JSON.stringify(projets, null, 2), "utf8");
    res.status(201).json(newProjet);
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ error: "Failed to add project" });
  }
});

// API: Update project
app.put("/api/projets/:id", (req, res) => {
  try {
    const projets = JSON.parse(fs.readFileSync(projetsFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = projets.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Project not found" });
    }
    projets[index] = { ...projets[index], ...req.body };
    fs.writeFileSync(projetsFile, JSON.stringify(projets, null, 2), "utf8");
    res.json(projets[index]);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// API: Delete project
app.delete("/api/projets/:id", (req, res) => {
  try {
    const projets = JSON.parse(fs.readFileSync(projetsFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = projets.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Project not found" });
    }
    const deletedProjet = projets.splice(index, 1)[0];
    fs.writeFileSync(projetsFile, JSON.stringify(projets, null, 2), "utf8");
    res.json(deletedProjet);
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// API: Get portfolio items
app.get("/api/portfolio", (req, res) => {
  try {
    const data = fs.readFileSync(portfolioFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading portfolio.json:", err);
    res.status(500).json({ error: "Failed to read portfolio" });
  }
});

// API: Add new portfolio item
app.post("/api/portfolio", (req, res) => {
  try {
    const items = JSON.parse(fs.readFileSync(portfolioFile, "utf8"));
    const newItem = req.body;
    const maxId = items.length > 0 ? Math.max(...items.map((i) => i.id)) : 0;
    newItem.id = maxId + 1;
    items.push(newItem);
    fs.writeFileSync(portfolioFile, JSON.stringify(items, null, 2), "utf8");
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error adding portfolio item:", err);
    res.status(500).json({ error: "Failed to add portfolio item" });
  }
});

// API: Update portfolio item
app.put("/api/portfolio/:id", (req, res) => {
  try {
    const items = JSON.parse(fs.readFileSync(portfolioFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }
    items[index] = { ...items[index], ...req.body };
    fs.writeFileSync(portfolioFile, JSON.stringify(items, null, 2), "utf8");
    res.json(items[index]);
  } catch (err) {
    console.error("Error updating portfolio item:", err);
    res.status(500).json({ error: "Failed to update portfolio item" });
  }
});

// API: Delete portfolio item
app.delete("/api/portfolio/:id", (req, res) => {
  try {
    const items = JSON.parse(fs.readFileSync(portfolioFile, "utf8"));
    const id = parseInt(req.params.id);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }
    const deletedItem = items.splice(index, 1)[0];
    fs.writeFileSync(portfolioFile, JSON.stringify(items, null, 2), "utf8");
    res.json(deletedItem);
  } catch (err) {
    console.error("Error deleting portfolio item:", err);
    res.status(500).json({ error: "Failed to delete portfolio item" });
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

// API: Upload image
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Return the image path
    const imagePath = `images/${req.file.filename}`;
    res.json({
      success: true,
      imagePath: imagePath,
      message: "Image uploaded successfully",
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
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
