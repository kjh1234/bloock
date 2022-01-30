// import { dialog }  from "electron"
// globalThis.electron = electron
const fs = require('fs');
const path = require('path');
const { app} = require("electron").remote;


if (!fs.existsSync(app.getPath('temp'))){
    fs.mkdirSync(app.getPath('temp'));
}

fs.rm(path.join(app.getPath('temp'), 'refresh.bat'), (err) => {
    fs.copyFile(path.join(__dirname, 'public/refresh.bat'), path.join(app.getPath('temp'), 'refresh.bat'), (err) => {
        if (err) {
            console.error("fs.writeFile", err);
        }
        console.log('Hello from preload.js!');
    })
})
