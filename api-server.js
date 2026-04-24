/**
 * Simple API Server for saving admin data to JSON files
 * Run: node api-server.js
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3001;
const IMAGE_DIR = path.join(__dirname, "images");

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL
  const parsedUrl = url.parse(req.url, true);

  // Images listing endpoint
  if (parsedUrl.pathname === "/api/images" && req.method === "GET") {
    try {
      fs.mkdirSync(IMAGE_DIR, { recursive: true });
      const filenames = fs.readdirSync(IMAGE_DIR);
      const images = filenames
        .filter((name) => !name.startsWith("."))
        .map((name) => `images/${name}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(images));
    } catch (error) {
      console.error("❌ Erreur lors de la lecture du dossier images:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }

    return;
  }

  // Save data endpoint
  if (parsedUrl.pathname === "/api/save-data" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const { dataType, items } = data;

        // Determine which file to save
        let filename;
        switch (dataType) {
          case "projects":
            filename = "projets.json";
            break;
          case "portfolio":
            filename = "portfolio.json";
            break;
          case "services":
            filename = "services.json";
            break;
          default:
            throw new Error("Unknown data type");
        }

        const filepath = path.join(__dirname, filename);

        // Write to file
        fs.writeFileSync(filepath, JSON.stringify(items, null, 2));

        // Log success
        console.log(`✅ ${filename} mis à jour (${items.length} éléments)`);

        // Send success response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: `${filename} sauvegardé avec succès`,
            itemCount: items.length,
          }),
        );
      } catch (error) {
        console.error("❌ Erreur:", error.message);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            error: error.message,
          }),
        );
      }
    });
  } else {
    // 404
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 API Server démarré sur http://localhost:${PORT}`);
  console.log(`📝 Endpoints: GET /api/images, POST /api/save-data`);
  console.log(`💾 Les données seront sauvegardées dans les fichiers JSON\n`);
});
