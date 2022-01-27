import { writable } from 'svelte/store';

export const bundleList = writable(JSON.parse( localStorage.getItem("bundleList") || "[]"));

bundleList.subscribe(val => localStorage.setItem("bundleList", JSON.stringify( val)));