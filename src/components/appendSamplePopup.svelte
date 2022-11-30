<script>
	import { createEventDispatcher } from 'svelte';
    import { Button, Col, Row, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter,
        Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Label, Input } from "sveltestrap";
	import {samples} from '../stores/samples';
    
    const dispatch = createEventDispatcher();
    let open = false;
    let selected = -1;

    $: if (open === false) {
        selected =-1
    }

    export const createModalOpen = () => { 
        open = true; 
    };
    export const createModalClose = () => {open = false };
    const createModalConfirm = () => {
		dispatch('message', samples[selected]);
        createModalClose()
    }

    function selectedSample (index) {
        selected = selected === index? -1 : index
    }
    
</script>
<style>
:global(.select-launcher .launcher-item) {
    width: 190px;
    float: left;
    margin-left: 12px;
    margin-top: 12px;
}
:global(.select-launcher .launcher-item:first) {
    margin-left: 0;
    margin-top: 0;
}
.apps-icon {
    width: 50px;
    height: 50px;
    margin: 10px 12px;
}
</style>

<Modal isOpen={open} toggle={createModalClose}>
    <ModalHeader toggle={createModalClose}>샘플추가</ModalHeader>
    <ModalBody class="select-launcher">
        <Card class="launcher-item" on:click={() => { selectedSample(0) }}>
            <CardHeader class={selected === 0? "bg-primary": ""}>
                <CardTitle>Chrome</CardTitle>
            </CardHeader>
            <CardBody>
                <img class="apps-icon" src="/apps/google-chrome.png" alt="chrome"/>
            </CardBody>
        </Card>
        <Card class="launcher-item" on:click={() => { selectedSample(1) }}>
            <CardHeader class={selected === 1? "bg-primary": ""}>
                <CardTitle>NodeJS + VScode</CardTitle>
            </CardHeader>
            <CardBody>
                <img class="apps-icon" src="/apps/nodejs.png" alt="NodeJS"/>
                <img class="apps-icon" src="/apps/npm-icon.png" alt="NPM"/>
                <img class="apps-icon" src="/apps/git-icon.png" alt="GIT"/>
                <img class="apps-icon" src="/apps/visual-studio-code-icon.png" alt="VS Code"/>
            </CardBody>
        </Card>
        <Card class="launcher-item" on:click={() => { selectedSample(2) }}>
            <CardHeader class={selected === 2? "bg-primary": ""}>
                <CardTitle>Java + Vs Code</CardTitle>
            </CardHeader>
            <CardBody>
                <img class="apps-icon" src="/apps/java-icon.png" alt="Java"/>
                <img class="apps-icon" src="/apps/apache-maven-icon.png" alt="Maven"/>
                <img class="apps-icon" src="/apps/git-icon.png" alt="GIT"/>
                <img class="apps-icon" src="/apps/visual-studio-code-icon.png" alt="VS Code"/>
            </CardBody>
        </Card>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" disabled={selected < 0} on:click={createModalConfirm}>추가</Button>
        <Button color="warning" on:click={createModalClose}>닫기</Button>
    </ModalFooter>
</Modal>