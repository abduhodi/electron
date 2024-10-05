
// Elements
const mainPage = document.getElementById('mainPage');
const writeSection = document.getElementById('writeSection');
const readSection = document.getElementById('readSection');

const readBtn = document.getElementById('readBtn');
const writeBtn = document.getElementById('writeBtn');
const readFileBtn = document.getElementById('readFile');
const writeFileBtn = document.getElementById('writeFile');
const backToMainFromWrite = document.getElementById('backToMainFromWrite');
const backToMainFromRead = document.getElementById('backToMainFromRead');
const openFileButton = document.getElementById('openFile');
const saveFileButton = document.getElementById('saveFile');
const writeLogs = document.getElementById('writeLogs');
const readLogs = document.getElementById('readLogs');
const portInputRead = document.getElementById('portInputRead');
const portInputWrite = document.getElementById('portInputWrite');
const saveFileResult = document.getElementById('saveFileResult'); 
const openFileResult = document.getElementById('openFileResult');
const clearWriteLog = document.getElementById('clearWriteLog');
const clearReadLog = document.getElementById('clearReadLog');
let port = '';
let filename = '';

// Show write section
writeBtn.addEventListener('click', () => {
    mainPage.style.display = 'none';
    writeSection.style.display = 'block';
});

// Show read section
readBtn.addEventListener('click', () => {
    mainPage.style.display = 'none';
    readSection.style.display = 'block';
});

// Back to main page from write
backToMainFromWrite.addEventListener('click', () => {
    writeSection.style.display = 'none';
    mainPage.style.display = 'block';
    saveFileResult.textContent = '';
    openFileResult.textContent = '';
    portInputWrite.value = '';
});

// Back to main page from read
backToMainFromRead.addEventListener('click', () => {
    readSection.style.display = 'none';
    mainPage.style.display = 'block';
    saveFileResult.textContent = '';
    openFileResult.textContent = '';
    portInputRead.value = '';
});

// Clear Write Logs
clearReadLog.addEventListener('click', () => {
    readLogs.value = '';
});

// Clear Write Logs
clearWriteLog.addEventListener('click', () => {
    writeLogs.value = '';
});

// Open file dialog
openFileButton.addEventListener('click', async () => {
    openFileResult.textContent = `openiiiing`;
    const filePath = await window.electronAPI.openOpenDialog();
    if (filePath) {
        openFileResult.textContent = `${filePath}`;
    }
});

// Save file dialog
saveFileButton.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openSaveDialog();
    if (filePath) {
        saveFileResult.textContent = `${filePath}`;
    }
});

// Read from chip
readFileBtn.addEventListener('click', async () => {
    if (await isInputsValid("read")) {

        readLogs.value = "reading from bios..."

        port = portInputRead.value.trim();
        filename = saveFileResult.textContent.trim();

        const command = readFromBios(port, filename);
        let response;

        try {
            
            response = await window.electronAPI.runCommand(command);

        } catch (error) {
            
            response = error;
            console.log(response)

        }
        readLogs.value = response.message;

    }
});

// Write to chip
writeFileBtn.addEventListener('click', async () => {
    if (await isInputsValid("write")) {

        writeLogs.value = "writing into bios..."

        port = portInputWrite.value.trim();
        filename = openFileResult.textContent.trim();

        const command = writeIntoBios(port, filename);
        let response;

        try {

            response = await window.electronAPI.runCommand(command);
            
        } catch (error) {

            response = error;
            console.log(response)
            
        }
        writeLogs.value = response.message;

    }
});

// Function to check if port input is empty
async function isInputsValid(action) {
    if (action === 'read') {
        if (!saveFileResult.textContent.trim()) {
            await window.electronAPI.showDialog('Please choose a destination to save the output file.');
            return false;
        }
        if (!portInputRead.value.trim()) {
            await window.electronAPI.showDialog('Please enter a port number before proceeding.');
            return false;
        }
    } else {
        if (!openFileResult.textContent.trim()) {
            await window.electronAPI.showDialog('Please choose a BIN file to write into the chip.');
            return false;
        }
        if (!portInputWrite.value.trim()) {
            await window.electronAPI.showDialog('Please enter a port number before proceeding.');
            return false;
        }
    }
    return true;
}

function writeIntoBios(port, filename) {
    return `python -m esptool --chip esp32 -p ${port} -b 115200 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0x0 "${filename}"`;
};

function readFromBios(port, filename) {
    return `python -m esptool -p ${port} -b 115200 read_flash 0 ALL ${filename}`;
};