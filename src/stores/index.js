import { writable } from 'svelte/store';

export const bundleList = writable(JSON.parse( localStorage.getItem("bundleList") || "[]"));
export const globalConfig = writable(JSON.parse( localStorage.getItem("config") || "{}"));

bundleList.subscribe(val => localStorage.setItem("bundleList", JSON.stringify( val)));
globalConfig.subscribe(val => localStorage.setItem("config", JSON.stringify( val)));