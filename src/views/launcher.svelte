<script>
    import { getContext, tick, onDestroy } from "svelte";
    // import { dialog } from "electron";
    import { bundleList } from "../stores";
    import { Button, Navbar, NavbarBrand, ListGroup, ListGroupItem, InputGroup, InputGroupText, FormGroup, Label, Input, Modal, Progress } from "sveltestrap";
    import { Trash2Icon } from "svelte-feather-icons";
    import InstallConfig from "../components/InstallConfig.svelte";
    import { PATHS, FILES} from "../const/index.js";
    import { v4 } from "uuid";

    const { app, dialog} = require("electron").remote;
    const child = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const url = require('url');
    
    export let currentRoute;
    const params = {};

    let bundles = [];
    let lancher = {};
    let config = {}
    let cmdInputs = [];
    let fileDownloads = [];
    let downloadOpen = false;

    $: bundleId = parseInt(currentRoute.namedParams.bundleId);
    $: lancherId = parseInt(currentRoute.namedParams.lancherId);
    $: lastCmdInput = cmdInputs[cmdInputs.length-1]
    $: watch1 = getContext("currentLancherId")(lancherId)
    $: watch2 = (() => {
        let bundle = bundles.filter((e) => e.id === bundleId)[0];
        lancher = bundle.lanchers.filter((e) => e.id === lancherId)[0];
        config = lancher.config = Object.assign({
            vGpu: false,
            network: true,
            sharedFolders: [],
            installs: [],
            preCmds: []
        }, lancher.config);
    })()
    $: installs = config.installs;

    bundleList.subscribe((value) => {
        bundles = value;
    });

    onDestroy(() => {
        bundleList.set(bundles);
    });


    const appendFolder = () => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(result => {
            if (result.canceled === false) {
                config.sharedFolders.push({
                    path: result.filePaths[0],
                    readOnly: true
                })
                config = config;
                bundleList.set(bundles);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const removeFolder = (folder) => {
        if(confirm("삭제 하시겠습니까?")){
            config.sharedFolders = config.sharedFolders.filter(e => e !== folder)
            bundleList.set(bundles);
        }
    }

    const appendCommand = (e) => {
        e.preventDefault();
        config.preCmds.push({cmd: ""})
        config = config;
        bundleList.set(bundles);

        tick().then(() => {
            e.target.blur(); 
            lastCmdInput.$$.ctx[lastCmdInput.$$.props.inner].focus();
        });
    }
    const removeCommand = (cmd) => {
        config.preCmds = config.preCmds.filter(e => e !== cmd)
        bundleList.set(bundles);
    }
    
    const appendInstall = (e) => {
        e.preventDefault();
        config.installs.push({
            url: "",
            cmd: ""
        })
        config = config;
        bundleList.set(bundles);

    }
    const removeInstall = (install) => {
        config.installs = config.installs.filter(e => e !== install)
        bundleList.set(bundles);
    }
    
    const run = () => {
        let wsdFile = FILES.WSB
        let tempPath = PATHS.INSTALL_CACHE
        let installFile = FILES.INSTALL
        let runnerFile = FILES.RUNNER

        let sandboxPath = PATHS.SANDBOX

        let wsd = `
            <Configuration>
                <vGpu>${config.vGpu? 'Enable': 'Disable'}</vGpu>
                <Networking>${config.network? 'Enable': 'Disable'}</Networking>
                <MappedFolders>
                    <MappedFolder>
                        <SandboxFolder>${sandboxPath}</SandboxFolder>
                        <HostFolder>${tempPath}</HostFolder>
                        <ReadOnly>true</ReadOnly>
                    </MappedFolder>
                ${config.sharedFolders.map(e => `
                    <MappedFolder>
                        <HostFolder>${e.path}</HostFolder>
                        <ReadOnly>${e.readOnly}</ReadOnly>
                    </MappedFolder>
                `).join('')}
                </MappedFolders>
                <LogonCommand>
                    <Command>${sandboxPath}\\bloock-install.bat</Command>
                </LogonCommand>
            </Configuration>
        `

        if (!fs.existsSync(tempPath)){
            fs.mkdirSync(tempPath);
        }

        if (!fs.existsSync(app.getPath('userData'))){
            fs.mkdirSync(app.getPath('userData'));
        }

        downloadOpen = true;
        fileDownloads = [];
        Promise.all(downloads(installs)).then(() => {
            downloadOpen = false;
            fileDownloads = [];
        }).then(() => {
            return Promise.all([
                new Promise(resolve => fs.rm(wsdFile, (err) => {
                    if (err) { console.error("fs.wsdFile", err); } 
                    resolve()
                })),
                new Promise(resolve => fs.rm(installFile, (err) => {
                    if (err) { console.error("fs.installFile", err); } 
                    resolve()
                })),
                new Promise(resolve => fs.rm(runnerFile, (err) => {
                    if (err) { console.error("fs.runnerFile", err); } 
                    resolve()
                }))
            ])

        }).then(() => {
            return Promise.all([,
                new Promise(resolve => fs.writeFile(wsdFile, wsd, (err) => {
                    resolve()
                })),
                new Promise(resolve => fs.writeFile(installFile, 
                    `
                    \n${installs.map(e => `${e.cmd.replace(/%APP_PATH%/, sandboxPath)}`).join('\n')}
                    \n${sandboxPath}\\refresh.bat
                    `, (err) => {
                        resolve()
                })),
                new Promise(resolve => fs.writeFile(runnerFile, config.preCmds.map(e => `${e.cmd}`).join('\n'), (err) => {
                    resolve()
                }))
            ])
        }).then(() => {

            child.exec(wsdFile, function(err, data) {
                if (err) {
                    console.error("child", err);
                } 
                console.log(data.toString());
            })
        })
    }

    const downloads = () => {
        let tempPath = PATHS.INSTALL_CACHE
        return installs.map(install => 
            new Promise(res => {
                fs.stat(path.join(tempPath, install.name), (err, stats) => {
                    res(stats)
                });
            }).then(stats => {
                let tempName = v4();
                if(stats) {
                    return path.join(tempPath, install.name)
                }
                
                fileDownloads.push({
                    id: tempName,
                    name: install.name,
                    display: `Downloading... ${install.name}`,
                    percent: 0,
                    size: 0,
                    totalSize: 0
                })

                return download(install.url, tempName).then(res => {
                    let fileDownload = fileDownloads.filter(e => e.id === tempName)[0]
                    fileDownload.display = `Download Complate! ${install.name}`;
                    fileDownloads = fileDownloads;
                    return fs.rename(path.join(tempPath, tempName), path.join(tempPath, install.name), (err) => {
                        if (err) throw err;
                        fileDownload.display = `Renamed Complate! ${install.name}`;
                        console.log(`renamed complete ${tempName} => ${install.name}`);
                        fileDownloads = fileDownloads;
                    });
                })
            })
        )
    }

    function download(uri, tempName) {
        let tempPath = PATHS.INSTALL_CACHE
        let protocol = url.parse(uri).protocol.slice(0, -1);

        return new Promise((resolve, reject) => {
            const onError = function (e) {
                fs.unlink(tempName);
                reject(e);
            }
            let client = require("http");
            let options = {};
            let fileDownload = fileDownloads.filter(e => e.id === tempName)[0]

            if(protocol === "https"){
                client = require("https");
                options = {rejectUnauthorized: false}
            }
            client.get(uri, options, function(response) {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    var fileStream = fs.createWriteStream(path.join(tempPath, tempName));
                    fileDownload.size = 0;
                    fileDownload.totalSize = (response.headers||{'content-length': -1})['content-length'];

                    fileStream.on('error', onError);
                    fileStream.on('close', resolve);

                    response.pipe(fileStream);

                    response.on('data', function(chunk) {
                        fileDownload.size += chunk.length;
                        fileDownload.percent = parseInt((fileDownload.size / fileDownload.totalSize) * 100, 10);
                        fileDownloads = fileDownloads;
                    });
                } else if (response.headers.location) {
                    resolve(download(response.headers.location, tempName));
                } else {
                    reject(new Error(response.statusCode + ' ' + response.statusMessage));
                }
            }).on('error', onError);
        })
    };
</script>

<Navbar color="light" light expand="md">
    <Input placeholder="Check it out" bind:value={lancher.name} />
    <Button color="primary" outline on:click={run}>Run</Button>
</Navbar>

<FormGroup>
    <Input id="vGpu" type="checkbox" bind:checked={config.vGpu} label="vGPU" />
</FormGroup>
<FormGroup>
    <Input id="vGpu" type="checkbox" bind:checked={config.network} label="Networking" />
</FormGroup>
<FormGroup>
    <Button color="primary" outline on:click={appendFolder}>폴더 추가</Button>
    <ListGroup numbered>
        {#each config.sharedFolders as folder, index}
        <ListGroupItem>
            <InputGroup>
                <Input placeholder="Check it out" bind:value={folder.path} readonly/>
                <InputGroupText>
                    <Input id="readOnly_{index}" type="checkbox" bind:checked={folder.readOnly} aria-label="ReadOnly" />
                    <span on:click={removeFolder(folder)}><Trash2Icon size="1x"/></span>
                </InputGroupText>
            </InputGroup>
        </ListGroupItem>
        {/each}
    </ListGroup>
</FormGroup>

<FormGroup>
    <Button color="primary" outline on:click={appendInstall}>설치파일추가</Button>
    <ListGroup numbered>
        {#each installs as install, index}
        {JSON.stringify(install)}
        <InstallConfig bind:install={install} on:removeInstall={removeInstall(install)} />
        {/each}
    </ListGroup>
</FormGroup>

<FormGroup>
    <Label>시작 프로그램</Label>
    <ListGroup numbered>
        {#each config.preCmds as cmd, index}
        <ListGroupItem>
            <InputGroup>
                <Input placeholder="Append Command" bind:this="{cmdInputs[index]}" bind:value={cmd.cmd}/>
                <InputGroupText>
                    <span on:click={removeCommand(cmd)}><Trash2Icon size="1x"/></span>
                </InputGroupText>
            </InputGroup>
        </ListGroupItem>
        {/each}
    </ListGroup>
    <Input placeholder="new Command"  on:focus={appendCommand} />
</FormGroup>


<Modal body header="File Downloads" isOpen={downloadOpen}>
    {#each fileDownloads as dowload}
        {#if dowload.totalSize > -1}
            <Progress value={dowload.percent} color="success">{dowload.display}</Progress>
        {:else}
            <Progress value={100} color="info">{dowload.display}</Progress>
        {/if}
    {/each}
</Modal>