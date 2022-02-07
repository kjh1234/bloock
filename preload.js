// import { dialog }  from "electron"
// globalThis.electron = electron
const fs = require('fs');
const path = require('path');
const { app} = require("electron").remote;

let tempPath = path.join(app.getPath('userData'), 'temp')


if (!fs.existsSync(tempPath)){
    fs.mkdirSync(tempPath);
}

fs.rm(path.join(tempPath, 'refresh.bat'), (err) => {
    fs.copyFile(path.join(__dirname, 'public/refresh.bat'), path.join(tempPath, 'refresh.bat'), (err) => {
        if (err) {
            console.error("fs.writeFile", err);
        }
        console.log('Hello from preload.js!');
    })
})
