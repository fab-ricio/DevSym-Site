const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const partnersFile = path.join(__dirname, "partners.json");

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
