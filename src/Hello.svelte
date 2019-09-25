<h2><span class="hello">Hello</span><span class="_">_</span></h2>

<style>
	h2 {
		font-weight: normal;
		display: flex;
	}
	
	.hello {
		display: inline-block;
		width: 0;
		overflow: hidden;
		white-space: nowrap;
		animation: Hello steps(5) 1s 2s forwards;
	}
	
	._ {
		display: inline-block;
		opacity: 0;
		animation: _ linear .5s forwards 7;
	}
	
	@keyframes Hello {
		0% {width: 0;}
		100% {width: 3em;}
	}
	
	@keyframes _ {
		0% {opacity: 0}
		50% {opacity: 1}
		100% {opacity: 0}
	}
</style>