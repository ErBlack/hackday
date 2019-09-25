<h2><span>_</span></h2>

<style>
	h2 {
		font-weight: normal;
	}
	h2:before {
		content: '';
		animation: Hello ease-out 1s 2s forwards;
	}
	
	span {
		opacity: 0;
		animation: _ linear .5s forwards 7;
	}
	
	@keyframes Hello {
		0% {content: ''}
		20% {content: 'H'}
		40% {content: 'He'}
		60% {content: 'Hel'}
		80% {content: 'Hell'}
		100% {content: 'Hello'}
	}
	
	@keyframes _ {
		0% {opacity: 0}
		50% {opacity: 1}
		100% {opacity: 0}
	}
</style>