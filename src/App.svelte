<script>
	import { setContext } from 'svelte'
	import { Styles } from "sveltestrap";
	import { Router } from "svelte-router-spa";
	import { routes } from "./routes";
	// import { os } from "os";
	// import {remote} from 'electron';
	
	let options = { gaPageviews: true}
	// const os = require('os');
//   const app = remote.app;

// console.log("globalThis.electron", globalThis.electron)

    setContext("confirm", async (msg, callback) => {
        let confirmed = await confirm(msg);
        if (confirmed) {
			callback();
		}
    })
</script>
<Styles />

<!-- platform architecture: {os.arch()} -->
<Router {routes} {options}/>
