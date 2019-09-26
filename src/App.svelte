<script>
    import Timer from './Timer.svelte';
	import Hello from './Hello.svelte';
	import Typewriter from './Typewriter.svelte';
	import Links from './Links.svelte';
	import Twitter from './Twitter.svelte';
	import Copyright from './Copyright.svelte';
	import Terminal from './Terminal.svelte';
	
	const start = new Date('2019-10-12T11:00:00.000Z');
</script>
<link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap&subset=cyrillic" rel="stylesheet">
<style>
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
	}
	.address {
		line-height: 1em;
		font-size: .75em;
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
	<Typewriter>Приглашаю на день рождения</Typewriter>
	<Typewriter>{start.toLocaleString().slice(0, -3)}</Typewriter>
	<Typewriter>Приходите через</Typewriter>
	<Typewriter><Timer start={start}/></Typewriter>
	<br/>
	<Typewriter>Проспект Александровской Фермы 8</Typewriter>
	<div class="address">
		<Typewriter>7 парадная, 22 этаж, Квартира 1268</Typewriter>
	</div>
	<br/>
	<Links/>
	<br/>
	<Terminal/>
	<footer>
		<Twitter/>
		<Copyright/>
	</footer>
</div>