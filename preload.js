const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC methods to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
    openSaveDialog: () => ipcRenderer.invoke('open-save-dialog'),
    openOpenDialog: () => ipcRenderer.invoke('open-open-dialog'),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', { filePath, content }),
    showDialog: (message) => ipcRenderer.invoke('show-dialog', message),
    runCommand: (command) => ipcRenderer.invoke('run-command', command)
});
