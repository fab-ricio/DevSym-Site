const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let siteProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 560,
    minWidth: 520,
    minHeight: 560,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "electron.html"));
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true, ...options });
    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("error", (error) => reject(error));
    child.on("close", (code) => {
      if (code === 0) {
        resolve(output || "Terminé.");
      } else {
        reject(new Error(errorOutput || `Code de sortie ${code}`));
      }
    });
  });
}

ipcMain.handle("start-site", async () => {
  if (siteProcess) {
    return "Le site est déjà démarré.";
  }

  siteProcess = spawn("npm", ["run", "dev"], {
    shell: true,
    cwd: __dirname,
  });

  siteProcess.stdout.on("data", (data) => {
    mainWindow?.webContents.send("site-log", data.toString());
  });
  siteProcess.stderr.on("data", (data) => {
    mainWindow?.webContents.send("site-log", data.toString());
  });

  siteProcess.on("close", () => {
    mainWindow?.webContents.send("site-log", "Le site a été arrêté.\n");
    siteProcess = null;
  });

  return "Serveur démarré. Patientez quelques instants le temps que le site soit disponible.";
});

ipcMain.handle("stop-site", async () => {
  if (!siteProcess) {
    return "Aucun site en cours d'exécution.";
  }

  siteProcess.kill();
  siteProcess = null;
  return "Arrêt demandé pour le site.";
});

ipcMain.handle("open-site", async () => {
  await shell.openExternal("http://localhost:3000");
  return "Ouverture de http://localhost:3000";
});

ipcMain.handle("git-update", async (_, message) => {
  if (!message || !message.trim()) {
    throw new Error("Le message de commit est requis.");
  }

  await runCommand("git", ["add", "."], { cwd: __dirname });
  await runCommand(`git commit -m ${JSON.stringify(message)}`, [], { cwd: __dirname });
  const result = await runCommand("git", ["push"], { cwd: __dirname });
  return result;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
