<script>
    import { createEventDispatcher } from "svelte";
    import { ListGroupItem, InputGroup, InputGroupText, Input, Button } from "sveltestrap";
    import { Trash2Icon } from "svelte-feather-icons";
    export let install

    let {url, name, cmd} = install
    $: watch1 = (() => {
        console.log("wathc1")
        let fileName = install.url.split('/').reduce((a, b) => b, '');
        install.name = install.name || fileName;
    })()

	const dispatch = createEventDispatcher();
	function removeInstall() {
		dispatch('removeInstall');
	}

</script>


<ListGroupItem>
    <InputGroup>
        <Input placeholder="Append URL" bind:value={install.url}/>
        <InputGroupText>
            <span on:click={removeInstall}><Trash2Icon size="1x"/></span>
        </InputGroupText>
    </InputGroup>
    <InputGroup>
        <Input type="text" placeholder="Append FileName" bind:value={install.name}/>
        <InputGroupText>
            <Button>Cache Remove</Button>
        </InputGroupText>
    </InputGroup>
    <Input type="textarea" placeholder="Append Install Command" bind:value={install.cmd}/>
</ListGroupItem>