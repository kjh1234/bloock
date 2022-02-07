<script>
    import { createEventDispatcher } from "svelte";
    import { ListGroupItem, InputGroup, InputGroupText, Input, Button } from "sveltestrap";
    import { Trash2Icon } from "svelte-feather-icons";
    export let install

    let {url, name, cmd} = install
    $: watch1 = (() => {
        console.log("wathc1")
        let fileName = url.split('/').reduce((a, b) => b, '');
        name = name || fileName;
        install = {url, name, cmd}
    })()

	const dispatch = createEventDispatcher();
	function removeInstall() {
		dispatch('removeInstall');
	}

</script>


<ListGroupItem>
    <InputGroup>
        <Input placeholder="Append URL" bind:value={url}/>
        <InputGroupText>
            <span on:click={removeInstall}><Trash2Icon size="1x"/></span>
        </InputGroupText>
    </InputGroup>
    <InputGroup>
        <Input type="text" placeholder="Append FileName" bind:value={name}/>
        <InputGroupText>
            <Button>Cache Remove</Button>
        </InputGroupText>
    </InputGroup>
    <Input type="textarea" placeholder="Append Install Command" bind:value={cmd}/>
</ListGroupItem>