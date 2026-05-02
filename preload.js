const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startSite: () => ipcRenderer.invoke("start-site"),
  stopSite: () => ipcRenderer.invoke("stop-site"),
  openSite: () => ipcRenderer.invoke("open-site"),
  gitUpdate: (message) => ipcRenderer.invoke("git-update", message),
});

ipcRenderer.on("site-log", (_, message) => {
  window.dispatchEvent(new CustomEvent("site-log", { detail: message }));
});
