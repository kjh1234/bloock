<script>
    import { setContext, tick } from 'svelte'
    import { navigateTo, Navigate, Route } from "svelte-router-spa";
    import { Button, Col, Row, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "sveltestrap";
    import { Trash2Icon } from "svelte-feather-icons";
    import AppendSamplePopup from "../components/appendSamplePopup.svelte";
    import { bundleList } from "../stores";
    export let currentRoute;
    const params = {};

    let list = [];
    let bundles = [];
    let launcherName = "";
    let launcherNameInput;
    let open = false;
    let samplePopup;

    $: bundleId = parseInt(currentRoute.namedParams.bundleId);
    $: lancherId = parseInt(currentRoute.namedParams.lancherId);
    $: watch1 = (() => {
        let bundle = bundles.filter(
            (e) => e.id === bundleId
        )[0];
        bundle.lanchers = bundle.lanchers || [];
        list = bundle.lanchers;
    })()

    setContext("currentLancherId", (value) => {
        lancherId = value
    })

    bundleList.subscribe((value) => {
        bundles = value;
    });

    const createModalOpen = () => {
        launcherName = "";
        open = true;

        tick().then(() => {
            launcherNameInput.$$.ctx[launcherNameInput.$$.props.inner].focus();
        });
    }
    const createModalClose = () => (open = false);
    const createLauncher = () => {
        if (launcherName.length === 0) {
            alert("Empty Launcher Name!");
            return;
        }
        let nextId = list.reduce((a, b) => (a < b.id ? b.id : a), 0) + 1;
        list.push({ id: nextId, name: launcherName }), (list = list);

        bundleList.set(bundles);

        launcherName = "";
        createModalClose();
    };
    const createLauncherKeyPress = e => {
        if (e.charCode === 13) createLauncher();
    };
    const handleChangeLauncher = (id) => {
        // lancherId = id
        navigateTo(`/bundle/${bundleId}/launcher/${id}`)
    }

    const removeLauncher = async (launcher) => {
        if(lancherId === launcher.id) {
        navigateTo(`/bundle/${bundleId}`)
        }

        await tick();
        let bundle = bundles.filter(
            (e) => e.id === bundleId
        )[0];
        list = list.filter(e => e !== launcher)
        bundle.lanchers = list
        bundleList.set(bundles);
    }

    function createModalSampleOpen(e) {
        let {ctx, props} = samplePopup.$$;
        ctx[props.createModalOpen]();
    }

    function handleMessage (event) {
        if(event.detail) {
            let nextId = list.reduce((a, b) => (a < b.id ? b.id : a), 0) + 1;
            list.push(Object.assign({ id: nextId}, event.detail));
            list = list // state update
            bundleList.set(bundles);
        }
	}
</script>

bundle

<Navigate to="/">Main</Navigate>

Launcher: <Button color="primary" outline on:click={createModalOpen}>Create</Button>
<Button color="primary" outline on:click={createModalSampleOpen}>Create[Sample]</Button>

<Row>
    <Col xs="3">
        <ListGroup>
            {#each list as item}
            <ListGroupItem tag="a" on:click={handleChangeLauncher(item.id)} active={lancherId === item.id} action>{item.name}
                <span style="float:right" on:click|preventDefault|stopPropagation={removeLauncher(item)}><Trash2Icon size="1x"/></span></ListGroupItem>
            {/each}
          </ListGroup>
    </Col>
    <Col>
        <Route {currentRoute} {params} />
    </Col>
</Row>

<Modal isOpen={open} toggle={createModalClose}>
    <ModalHeader toggle={createModalClose}>Create New Launcher</ModalHeader>
    <ModalBody>
        <Form>
            <FormGroup>
                <Input
                    type="text"
                    name="launcherName"
                    id="launcherName"
                    placeholder="plase launcher name!"
                    bind:this={launcherNameInput}
                    on:keypress={createLauncherKeyPress}
                    bind:value={launcherName}
                />
            </FormGroup>
        </Form>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={createLauncher}>Create</Button>
    </ModalFooter>
</Modal>


<AppendSamplePopup bind:this={samplePopup} on:message={handleMessage}></AppendSamplePopup>