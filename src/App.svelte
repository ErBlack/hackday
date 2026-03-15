<script>
	import Hello from './Hello.svelte';
	import Typewriter from './Typewriter.svelte';
	import Credentials from './Credentials.svelte';
	import Copyright from './Copyright.svelte';
	import Terminal from './Terminal.svelte';
	import { onMount } from 'svelte';
	
	let ribbon;

	onMount(() => {
		ribbon = document.querySelector('.ribbon');
	});

	function onExec() {
		if (ribbon) {
			setTimeout(() => ribbon.scrollTop = ribbon.scrollHeight, 0)
		}
	}
</script>
<link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap&subset=cyrillic" rel="stylesheet">
<style>
	:global(html) {
		height: 100%;
		width: 100%;
	}

	:global(body) {
		font-family: 'Roboto Mono', monospace;
		color: #14fd7e;
    background-color: #031e11;
		margin: 0;
		padding: 1em 0;
  	box-shadow: inset 0 0 18rem rgba(0,0,0,.5), inset 0 0 3rem rgba(0,0,0,.5);
		border-radius: 2rem;
  	border: 1em solid;
		border-bottom-color: #121212;
		border-left-color: #080808;
		border-right-color: #080808;
		border-top-color: #020202;
	text-shadow: 0 0.1em 0rem rgba(0,0,0,0.4), 0 0 2em rgba(0,0,0,0.8);
	min-width: 500px;
	min-height: 100%;
    box-sizing: border-box;
	}
	.ribbon {
		top: 1em;
		right: 1em;
		left: 1em;
		bottom: 1em;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 17px;
		bottom: 17px;
		overflow: auto;
		padding: 0 2em;
	}

	footer {
		display: flex;
		justify-content: space-between;
	}
</style>
<div class="ribbon">
	<Hello/>
	<Typewriter>Wake up...</Typewriter>
	<Terminal on:exec={onExec}/>
	<footer>
		<Credentials/>
		<Copyright/>
	</footer>
</div>