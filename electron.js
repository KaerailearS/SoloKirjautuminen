const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let backendProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "dist", "index.html"));
}

function startBackend() {
  const serverPath = path.join(__dirname, "quote-backend", "server.js");
  console.log("Launching backend from: ", serverPath);

  if (!fs.existsSync(serverPath)) {
    console.error("Backend file not found at: ", serverPath);
    return;
  }
  backendProcess = spawn(process.execPath, [serverPath], {
    cwd: path.dirname(serverPath),
    stdio: "inherit",
  });

  backendProcess.on("error", (err) => {
    console.error("Backend error: ", err);
  });

  backendProcess.on("exit", (code) => {
    console.log("Backend exited with code", code);
  });
}

app.whenReady().then(() => {
  console.log("App is ready");
  startBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception: ", err);
});
