<script>
    import { getContext, tick, onDestroy } from "svelte";
    // import { dialog } from "electron";
    import { bundleList } from "../stores";
    import { Button, Navbar, NavbarBrand, ListGroup, ListGroupItem, InputGroup, InputGroupText, FormGroup, Label, Input } from "sveltestrap";
    import { Trash2Icon } from "svelte-feather-icons";
    const { app, dialog} = require("electron").remote;
    const child = require('child_process');
    const fs = require('fs');
    const path = require('path');
    
    export let currentRoute;
    const params = {};

    let bundles = [];
    let lancher = {};
    let config = {}
    let cmdInputs = [];

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
        let wsdFile = path.join(app.getPath('userData'), 'temp.wsb')
        let installFile = path.join(app.getPath('temp'), 'bloock-install.bat')
        let runnerFile = path.join(app.getPath('temp'), 'runner.bat')

        let sandboxPath = "C:\\users\\WDAGUtilityAccount\\Desktop\\Temp"

        let wsd = `
            <Configuration>
                <vGpu>${config.vGpu? 'Enable': 'Disable'}</vGpu>
                <Networking>${config.network? 'Enable': 'Disable'}</Networking>
                <MappedFolders>
                    <MappedFolder>
                        <HostFolder>${app.getPath('temp')}</HostFolder>
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

        if (!fs.existsSync(app.getPath('temp'))){
            fs.mkdirSync(app.getPath('temp'));
        }

        if (!fs.existsSync(app.getPath('userData'))){
            fs.mkdirSync(app.getPath('userData'));
        }

        Promise.all([
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
        ]).then(() => {
            return Promise.all([,
                new Promise(resolve => fs.writeFile(wsdFile, wsd, (err) => {
                    resolve()
                })),
                new Promise(resolve => fs.writeFile(installFile, 
                    `${config.installs.map(e => `${e.cmd}`).join('\n')}
                    \n%USERPROFILE%\\Desktop\\Temp\\refresh.bat
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
        // child.exec(`start cmd @cmd /c type "${wsd.replaceAll('\n', '\\\\n').replaceAll('\r', '\\\\r')}" > temp.wsb`, function(err, data) {
        // child.exec(`start cmd @cmd type nul > temp.wsb`, function(err, data) {
        //     if(err){
        //     console.error(err);
        //     return;
        //     }
        
        //     console.log(data.toString());
        // });
    }
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
        {#each config.installs as install, index}
        <ListGroupItem>
            <InputGroup>
                <Input placeholder="Append URL" bind:value={install.url}/>
                <InputGroupText>
                    <span on:click={removeInstall(install)}><Trash2Icon size="1x"/></span>
                </InputGroupText>
            </InputGroup>
            <Input type="textarea" placeholder="Append Install Command" bind:value={install.cmd}/>
        </ListGroupItem>
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
