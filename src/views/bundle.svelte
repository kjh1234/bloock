<script>
    import { setContext } from 'svelte'
    import { navigateTo, Navigate, Route } from "svelte-router-spa";
    import { Button, Col, Row, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "sveltestrap";
    import { bundleList } from "../stores";
    export let currentRoute;
    const params = {};

    let list = [];
    let bundles = [];
    let launcherName = "";
    let open = false;

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

    const createModalOpen = () => ((launcherName = ""), (open = true));
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
    const handleChangeLauncher = (id) => {
        // lancherId = id
        navigateTo(`/bundle/${bundleId}/launcher/${id}`)
    }
</script>

bundle

<Navigate to="/">Main</Navigate>

Launcher: <Button color="primary" outline on:click={createModalOpen}
    >Create</Button
>
<p>Route params are: {JSON.stringify(currentRoute.namedParams)} and {JSON.stringify(currentRoute.queryParams)}</p>

<Row>
    <Col xs="3">
        <ListGroup>
            {#each list as item}
            <ListGroupItem tag="a" on:click={handleChangeLauncher(item.id)} active={lancherId === item.id} action>{item.name}</ListGroupItem>
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
                    bind:value={launcherName}
                    autofocus
                />
            </FormGroup>
        </Form>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={createLauncher}>Create</Button>
    </ModalFooter>
</Modal>
