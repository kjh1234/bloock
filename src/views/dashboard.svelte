<script>
    import { navigateTo } from "svelte-router-spa";
    import { bundleList } from "../stores";
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
        Popover, ListGroup, ListGroupItem
    } from "sveltestrap";
    import { MoreHorizontalIcon } from "svelte-feather-icons";

    let list = [];
    let bundleName = "";
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

    const createModalOpen = () => ((bundleName = ""), (open = true));
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
    const moveBundle = (id) => {
        navigateTo(`/bundle/${id}`);
    };
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
                                >Bundle <a id="{`btnMent${item.id}`}"
                                    style="float:right"
                                    on:click|stopPropagation={() => {}}  tabindex="0"
                                    ><MoreHorizontalIcon size="1x" /></a
                                ></CardTitle
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

<Modal isOpen={open} {createModalClose}>
    <ModalHeader {createModalClose}>Create New Bundle</ModalHeader>
    <ModalBody>
        <Form>
            <FormGroup>
                <Label for="exampleSearch">Search</Label>
                <Input
                    type="text"
                    name="bundleName"
                    id="bundleName"
                    placeholder="plase bundle name!"
                    bind:value={bundleName}
                    autofocus
                />
            </FormGroup>
        </Form>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={createBundle}>Create</Button>
    </ModalFooter>
</Modal>

{#each list as item}
<Popover placement="right" target="{`btnMent${item.id}`}" dismissible>
    <ListGroup>
        <ListGroupItem color="danger">삭제</ListGroupItem>
    </ListGroup>
</Popover>
{/each}
