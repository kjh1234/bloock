// import { dialog }  from "electron"
// globalThis.electron = electron

const fs = require('fs');
const path = require('path');
const { app } = require("electron").remote;

let tempPath = path.join(app.getPath('userData'), 'temp')
let refreshFile = path.join(tempPath, 'refresh.bat')


if (!fs.existsSync(tempPath)){
    fs.mkdirSync(tempPath);
}

fs.rm(refreshFile, (err) => {
    fs.copyFile(path.join(__dirname, 'public/refresh.bat'), refreshFile, (err) => {
        if (err) {
            console.error("fs.writeFile", err);
        }
        console.log('Hello from preload.js!');
    })
})
