/**
 * Simple API Server for saving admin data to JSON files
 * Run: node api-server.js
 */

require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.API_PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error("❌ ADMIN_PASSWORD n'est pas défini dans le fichier .env");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL
  const parsedUrl = url.parse(req.url, true);

  // Login endpoint
  if (parsedUrl.pathname === "/login" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const { password } = data;

        if (!password) {
          throw new Error("Mot de passe requis");
        }

        if (password === ADMIN_PASSWORD) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: "Authentification réussie" }));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Mot de passe incorrect" }));
        }
      } catch (error) {
        console.error("❌ Erreur lors de la connexion:", error.message);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });

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
  console.log(`📝 Endpoint: POST /api/save-data`);
  console.log(`💾 Les données seront sauvegardées dans les fichiers JSON\n`);
});
