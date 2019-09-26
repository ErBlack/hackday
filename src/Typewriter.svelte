<style>
	.typewriter {
		display: inline-block;
		width: 0;
		overflow: hidden;
		white-space: nowrap;
		animation: type steps(30) 2s 3s forwards;
		flex-shrink: 0;
	}
	
	@keyframes type {
		0% {width: 0em;}
		100% {width: 18em;}
	}
</style>

<div class="typewriter">
	<slot></slot>
</div>