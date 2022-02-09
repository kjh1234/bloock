const path = require('path');
const { app} = require("electron").remote;

const PATHS = {
    INSTALL_CACHE: path.join(app.getPath('userData'), 'temp'),
    SANDBOX: path.join("C:\\Users\\WDAGUtilityAccount\\bloock", 'temp')
};

const FILES = {
    WSB: path.join(app.getPath('userData'), 'temp.wsb'),
    INSTALL: path.join(PATHS.INSTALL_CACHE, 'bloock-install.bat'),
    RUNNER: path.join(PATHS.INSTALL_CACHE, 'runner.bat'),
    REFRESH: path.join(PATHS.INSTALL_CACHE, 'refresh.bat')
};

export { PATHS, FILES };
