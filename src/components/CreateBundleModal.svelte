<script>
    import { createEventDispatcher, afterUpdate, tick } from "svelte";
    import { Modal, ModalBody, Form, FormGroup, Input } from "sveltestrap";
    export let value;
    export let open = false;
    export let placeholder;
    let input;
	const dispatch = createEventDispatcher();
    const createModalClose = () => (open = false, value = "");
	function createBundle() {
		dispatch('createBundle');
	}

    afterUpdate(() => {
        if(open) {
            tick().then(() => {
                //console.log("tick", input);
                input.$$.ctx[input.$$.props.inner].focus();
            });
            // input.focus();
            // lastCmdInput.$$.ctx[lastCmdInput.$$.props.inner].focus();
        }
    })

	function handleKeydown(event) {
        if(open !== true) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            createModalClose();
        } else if (event.key === 'Enter') {
            // trap focus
            createBundle();
            event.preventDefault();
        }
    };
</script>

<svelte:window on:keydown={handleKeydown}/>
<Modal isOpen={open}  backdrop="static" toggle={createModalClose}>
    <ModalBody>
        <Form>
            <FormGroup>
                <Input
                    type="text"
                    name="CreateBundleInput"
                    id="CreateBundleInput"
                    placeholder={placeholder}
                    bind:this="{input}"
                    bind:value={value}
                    autofocus
                />
            </FormGroup>
        </Form>
    </ModalBody>
</Modal>