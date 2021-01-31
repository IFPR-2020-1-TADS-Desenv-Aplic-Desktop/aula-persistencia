const { ipcRenderer } = require("electron")

exports.enableMenu = (config) => {
  ipcRenderer.send('action-enable-menu', config);
}