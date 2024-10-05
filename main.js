const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { exec } = require('node:child_process');

// Create the Electron window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false
        },
    });

    win.loadFile('index.html');
};

// Handle file save dialog
ipcMain.handle('open-save-dialog', async () => {
    const result = await dialog.showSaveDialog({
        title: 'Save File',
        defaultPath: path.join(app.getPath('documents'), 'untitled.txt'),
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });
    return result.filePath;
});

// Handle file open dialog
ipcMain.handle('open-open-dialog', async () => {
    const result = await dialog.showOpenDialog({
        title: 'Open File',
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });
    return result.filePaths[0];
});

// Handle reading file content
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        console.log(filePath)
        const content = fs.readFileSync(filePath, 'utf-8');
        return content;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
});

// Handle saving file content
ipcMain.handle('save-file', async (event, { filePath }) => {
    try {
        console.log(filePath)
        // fs.writeFileSync(filePath, content, 'utf-8');
        return 'File saved successfully';
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
});

// Handle error messages
ipcMain.handle('show-dialog', async (event, message) => {
    await dialog.showMessageBox({
        type: 'warning', // You can use 'info', 'warning', 'error', etc.
        message: message
    });
});

// Execute the command
ipcMain.handle('run-command', async (event, command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
});

app.whenReady().then(() => {
    createWindow();
});
