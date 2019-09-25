<script>
    import Timer from './Timer.svelte';
	  import Hello from './Hello.svelte';
		import Typewriter from './Typewriter.svelte';
	  import Links from './Links.svelte';
	
		const start = new Date('2019-10-12T11:00:00.000Z');
</script>
<link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap&subset=cyrillic" rel="stylesheet">
<style>
	:global(body) {
		font-family: 'Roboto Mono', monospace;
		color: #14fd7e;
    background-color: #031e11;
		margin: 0;
		padding: 1em 2em;
  	box-shadow: inset 0 0 18rem rgba(0,0,0,.5), inset 0 0 3rem rgba(0,0,0,.5);
		border-radius: 2rem;
  	border: 1rem solid;
		border-bottom-color: #121212;
		border-left-color: #080808;
		border-right-color: #080808;
		border-top-color: #020202;
    text-shadow: 0 0.1em 0rem rgba(0,0,0,0.4), 0 0 2em rgba(0,0,0,0.8);
	}
</style>
<div>
	<Hello/>
	<Typewriter>Приглашаю на день рождения {start.toLocaleString().slice(0, -3)}</Typewriter>
	<br/>
	<Typewriter>
		<Timer start={start}/>
	</Typewriter>
	<br/>
	<br/>
	<Typewriter>Проспект Александровской Фермы 8</Typewriter>
	<br/>
	<Typewriter>7 парадная, 22 этаж, Квартира 1268</Typewriter>
	<br/>
	<br/>
	<Links/>
</div>