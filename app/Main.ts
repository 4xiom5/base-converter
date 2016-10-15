import {app, BrowserWindow} from "electron";

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow = null;

function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 120,
        show: false,
        fullscreenable: false,
        maximizable: false,
        minimizable: false,
        autoHideMenuBar: true
    });

    win.loadURL(`file://${__dirname}/views/index.html`);

    win.on("closed", _ => {
        win = null;
    });

    win.once("ready-to-show", win.show);
}
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", _ => {
    process.platform !== "darwin" && app.quit();
});

app.on("activate", _ => {
    win === null && createWindow();
});