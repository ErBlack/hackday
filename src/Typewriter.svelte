<style>
	.typewriter {
		display: inline-block;
		width: 0;
		overflow: hidden;
		white-space: nowrap;
		animation: type steps(35) 2s 3s forwards;
	}
	
	@keyframes type {
		0% {width: 0em;}
		100% {width: 21em;}
	}
</style>

<div class="typewriter">
	<slot></slot>
</div>