import App from './App.svelte';
const { webFrame } = require("electron");
webFrame.setZoomFactor(0.7)
// import fs from 'fs';
// const fs = require('fs'); 	


const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;