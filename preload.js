const { contextBridge, ipcRenderer } = require('electron');

// Expose the ability to listen for messages
 
contextBridge.exposeInMainWorld('electronAPI', {
  onMessage: (callback) => ipcRenderer.on('message', (_, message) => callback(message)),
  sendMessage: (message) => ipcRenderer.send('message', message)  // ✅ تأكد أن هذه الدالة موجودة
});
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    //replaceText(`${type}-version`, process.versions[type])
  }
})
