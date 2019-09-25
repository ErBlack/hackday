<style>
	.typewriter {
		display: inline-block;
		width: 0;
		overflow: hidden;
		white-space: nowrap;
		animation: type steps(50) 1s 3s forwards;
	}
	
	@keyframes type {
		0% {width: 0em;}
		100% {width: 30em;}
	}
</style>

<div class="typewriter">
	<slot></slot>
</div>