<script>
    import { getContext, tick } from "svelte";
    // import { dialog } from "electron";
    import { bundleList } from "../stores";
    import { Button, Navbar, NavbarBrand, ListGroup, ListGroupItem, InputGroup, InputGroupText, FormGroup, Label, Input } from "sveltestrap";
    import { Trash2Icon } from "svelte-feather-icons";
import { windowsStore } from "process";
    
    const {dialog} = require("electron").remote;
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
            preCmds: []
        }, lancher.config);
    })()

    bundleList.subscribe((value) => {
        bundles = value;
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
        config.preCmds.push({cmd: ""})
        config = config;
        bundleList.set(bundles);

        e.preventDefault();

        tick().then(() => {
            e.target.blur(); 
            lastCmdInput.$$.ctx[lastCmdInput.$$.props.inner].focus();
        });
    }
    const removeCommand = (cmd) => {
        if(confirm("삭제 하시겠습니까?")){
            // config.preCmds = config.preCmds.filter(e => e !== cmd)
            // bundleList.set(bundles);

            // document.body.focus()
        }
    }
    console.log("dialog", dialog)

</script>

<Navbar color="light" light expand="md">
    <Input placeholder="Check it out" bind:value={lancher.name} />
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
