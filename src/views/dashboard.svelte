<script>
    import { navigateTo } from "svelte-router-spa";
    import { bundleList } from "../stores";
    import {
        Button,
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
    } from "sveltestrap";
    import CreateBundleModal from "../components/CreateBundleModal.svelte";
    import { MoreHorizontalIcon } from "svelte-feather-icons";

    let list = [];
    let bundleName = "";
    let open = false;
    let createModal;

    bundleList.subscribe((value) => {
        list = value;
    });

    $: groups = list.reduce(
        (a, b, c) => (
            c % 3 === 0 && a.push(new Array(3)), (a[a.length - 1][c % 3] = b), a
        ),
        []
    );

    const createModalOpen = () => (open = true);
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
                                <a id="{`btnMent${item.id}`}"
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


<CreateBundleModal bind:this={createModal} bind:open={open} bind:value={bundleName} placeholder="plase bundle name!" on:createBundle={createBundle}></CreateBundleModal>


{#each list as item}
<Popover placement="right" target="{`btnMent${item.id}`}" dismissible>
    <ListGroup>
        <ListGroupItem color="danger" on:click={removeBundle(item)}>삭제</ListGroupItem>
    </ListGroup>
</Popover>
{/each}
