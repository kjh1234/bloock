export const samples = [
    {
        "name": "chrome",
        "config": {
            "vGpu": true,
            "network": true,
            "sharedFolders": [],
            "installs": [
                {
                    "url": "http://dl.google.com/chrome/install/375.126/chrome_installer.exe",
                    "cmd": "%APP_PATH%\\chrome_installer-375.126.exe /silent /install",
                    "name": "chrome_installer-375.126.exe"
                }
            ],
            "preCmds": [
                {
                    "cmd": "chrome.exe"
                }
            ]
        }
    },

    {
        "name": "vscode-bloock",
        "config": {
            "vGpu": true,
            "network": true,
            "sharedFolders": [
                {
                    "path": "C:\\[Choose]\\git",
                    "readOnly": false
                }
            ],
            "installs": [
                {
                    "url": "https://github.com/git-for-windows/git/releases/download/v2.35.1.windows.2/Git-2.35.1.2-64-bit.exe",
                    "name": "Git-2.35.1.2-64-bit.exe",
                    "cmd": "%APP_PATH%\\Git-2.35.1.2-64-bit.exe /VERYSILENT "
                },
                {
                    "url": "https://update.code.visualstudio.com/latest/win32-x64-user/stable",
                    "name": "vscode-installer.exe",
                    "cmd": "%APP_PATH%\\vscode-installer.exe /verysilent /suppressmsgboxes /MERGETASKS=!runcode"
                },
                {
                    "url": "https://github.com/coreybutler/nvm-windows/releases/download/1.1.9/nvm-setup.zip",
                    "name": "nvm-setup-1.1.9.zip",
                    "cmd": "powershell expand-archive %APP_PATH%\\nvm-setup-1.1.9.zip %USERPROFILE%\\Desktop\n%USERPROFILE%\\Desktop\\nvm-setup.exe /VERYSILENT"
                }
            ],
            "preCmds": [
                {
                    "cmd": "start cmd /c code --install-extension svelte.svelte-vscode --force"
                },
                {
                    "cmd": "nvm install 16.13.0"
                },
                {
                    "cmd": "nvm use 16.13.0"
                },
                {
                    "cmd": "code -g %USERPROFILE%\\Desktop\\git\\[choose-project]"
                }
            ]
        }
    },
    {
        "name": "vscode-aws-batch",
        "config": {
            "vGpu": true,
            "network": true,
            "sharedFolders": [
                {
                    "path": "C:\\[Choose]\\git",
                    "readOnly": false
                }
            ],
            "installs": [
                {
                    "url": "https://dl.google.com/tag/s/appguid%3D%7B8A69D345-D564-463C-AFF1-A69D9E530F96%7D%26iid%3D%7B877A0398-CF2B-2222-CC5D-1522459EAAA5%7D%26lang%3Den%26browser%3D4%26usagestats%3D1%26appname%3DGoogle%2520Chrome%26needsadmin%3Dprefers%26ap%3Dx64-stable-statsdef_1%26installdataindex%3Dempty/chrome/install/ChromeStandaloneSetup64.exe",
                    "cmd": "%APP_PATH%\\ChromeStandaloneSetup64.exe /silent /install",
                    "name": "ChromeStandaloneSetup64.exe"
                },
                {
                    "url": "https://github.com/git-for-windows/git/releases/download/v2.35.1.windows.2/Git-2.35.1.2-64-bit.exe",
                    "cmd": "%APP_PATH%\\Git-2.35.1.2-64-bit.exe /VERYSILENT ",
                    "name": "Git-2.35.1.2-64-bit.exe"
                },
                {
                    "url": "https://update.code.visualstudio.com/latest/win32-x64-user/stable",
                    "cmd": "%APP_PATH%\\vscode-installer.exe /verysilent /suppressmsgboxes /MERGETASKS=!runcode",
                    "name": "vscode-installer.exe"
                },
                {
                    "url": "https://dlcdn.apache.org/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.zip",
                    "cmd": "powershell expand-archive %APP_PATH%\\apache-maven-3.8.4-bin.zip %USERPROFILE%\\maven",
                    "name": "apache-maven-3.8.4-bin.zip"
                },
                {
                    "url": "https://corretto.aws/downloads/resources/11.0.14.10.1/amazon-corretto-11.0.14.10.1-windows-x64.msi",
                    "cmd": "%APP_PATH%\\amazon-corretto-11.0.14.10.1-windows-x64.msi  /passive  /norestart",
                    "name": "amazon-corretto-11.0.14.10.1-windows-x64.msi"
                }
            ],
            "preCmds": [
                {
                    "cmd": "setx GRADLE_HOME \"%USERPROFILE%\\maven\\apache-maven-3.8.4\" && set GRADLE_HOME=%USERPROFILE%\\maven\\apache-maven-3.8.4"
                },
                {
                    "cmd": "setx PATH \"%PATH%;%USERPROFILE%\\maven\\apache-maven-3.8.4\\bin\" && set PATH=%PATH%;%USERPROFILE%\\maven\\apache-maven-3.8.4\\bin"
                },
                {
                    "cmd": "start cmd /c code --install-extension vscjava.vscode-java-pack --force"
                },
                {
                    "cmd": "start /b chrome"
                },
                {
                    "cmd": "code  -g %USERPROFILE%\\Desktop\\git\\[choose-project]"
                }
            ]
        }
    }
]