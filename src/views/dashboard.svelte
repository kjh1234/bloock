<script>
    import { tick } from "svelte";
    import { navigateTo } from "svelte-router-spa";
    import { bundleList, globalConfig } from "../stores";
    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Form,
        FormGroup,
        Input,
        Label,
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        CardTitle,
        Col,
        Row,
        Popover, ListGroup, ListGroupItem,
    Dropdown,
    ButtonDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
    } from "sveltestrap";
    import { MoreHorizontalIcon } from "svelte-feather-icons";

    let list = [];
    let bundleName = "";
    let bundleNameInput;
    let open = false;

    bundleList.subscribe((value) => {
        list = value;
    });

    $: groups = list.reduce(
        (a, b, c) => (
            c % 3 === 0 && a.push(new Array(3)), (a[a.length - 1][c % 3] = b), a
        ),
        []
    );

    const createModalOpen = () => {
        bundleName = "";
        open = true;

        tick().then(() => {
            bundleNameInput.$$.ctx[bundleNameInput.$$.props.inner].focus();
        });
    }
    const createModalClose = () => (open = false);
    const createBundle = () => {
        if (bundleName.length === 0) {
            alert("Empty Bundle Name!");
            return;
        }
        let nextId = list.reduce((a, b) => (a < b.id ? b.id : a), 0) + 1;
        list.push({ id: nextId, name: bundleName }), (list = list);
        bundleList.set(list);
        bundleName = "";
        createModalClose();
    };
    const createBundleKeyPress = e => {
        if (e.charCode === 13) createBundle();
    };
    const moveBundle = (id) => {
        navigateTo(`/bundle/${id}`);
    };

    const removeBundle = ( bundle) => {
        list = list.filter(e => e !== bundle)
        bundleList.set(list);
    }
</script>

<h1>dashboard</h1>
Bundle: <Button color="primary" outline on:click={createModalOpen}
    >Create</Button
>

{#each groups as group}
    <Row>
        {#each group as item, i}
            <Col>
                {#if item}
                    <Card class="mb-3" on:click={moveBundle(item.id)}>
                        <CardHeader>
                            <CardTitle
                                >Bundle 
                                <span style="float:right" on:click|stopPropagation={() => {}}>
                                    <Dropdown >
                                        <DropdownToggle nav ><MoreHorizontalIcon size="1x" /></DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem on:click={() => {removeBundle(item)}}>삭제</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    </span>
                                </CardTitle
                            >
                        </CardHeader>
                        <CardBody>
                            <CardSubtitle>{item.name}</CardSubtitle>
                            <CardText />
                        </CardBody>
                        <CardFooter>Footer</CardFooter>
                    </Card>
                {/if}
            </Col>
        {/each}
    </Row>
{/each}

<Modal isOpen={open} toggle={createModalClose}>
    <ModalHeader toggle={createModalClose}>Create New Bundle</ModalHeader>
    <ModalBody>
        <Form>
            <FormGroup>
                <Label for="bundleName">Bundle Name</Label>
                <Input
                    type="text"
                    name="bundleName"
                    id="bundleName"
                    placeholder="plase bundle name!"
                    bind:this={bundleNameInput}
                    on:keypress={createBundleKeyPress}
                    bind:value={bundleName}
                />
            </FormGroup>
        </Form>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={createBundle}>Create</Button>
    </ModalFooter>
</Modal>