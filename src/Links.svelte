<script>
	import Typewriter from './Typewriter.svelte';
	const links = [
		{
			icon: '<svg width="1em"fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M462.3 62.7c-54.5-46.4-136-38.7-186.6 13.5L256 96.6l-19.7-20.3C195.5 34.1 113.2 8.7 49.7 62.7c-62.8 53.6-66.1 149.8-9.9 207.8l193.5 199.8c6.2 6.4 14.4 9.7 22.6 9.7 8.2 0 16.4-3.2 22.6-9.7L472 270.5c56.4-58 53.1-154.2-9.7-207.8zm-13.1 185.6L256.4 448.1 62.8 248.3c-38.4-39.6-46.4-115.1 7.7-161.2 54.8-46.8 119.2-12.9 142.8 11.5l42.7 44.1 42.7-44.1c23.2-24 88.2-58 142.8-11.5 54 46 46.1 121.5 7.7 161.2z"/></svg>',
			text: 'Вишлист',
			href: 'https://yandex.ru/collections/user/erblack/_wishlist/'
		},
		{
			icon: '<svg width="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 464c-119.1 0-216-96.9-216-216S128.9 40 248 40s216 96.9 216 216-96.9 216-216 216zm0-312c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 160c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm0-88c-13.2 0-24 10.8-24 24s10.8 24 24 24 24-10.8 24-24-10.8-24-24-24zm-8-144c-88.2 0-160 71.8-160 160h32c0-70.6 57.4-128 128-128V88z"/></svg>',
			text: 'Пластинки',
			href: 'https://www.discogs.com/wantlist?user=ErBlack'
		},
		{
			icon: '<svg width="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"/></svg>',
			text: 'Чат',
			href: 'https://t.me/joinchat/AnHOJhXRaP9pF74nxXB8Dg'
		}
	]
</script>
<style>
	a {
		color: inherit;
	}
	
	.icon {
		display: block;
		opacity: 0;
		animation-fill-mode: forwards;
		margin-right: .3em;
	}
	
	.row {
		width: 20em;
		overflow: hidden;
		white-space: nowrap;
		display: flex;
		line-height: 1.8em;
    	align-items: center;
	}
	
	.row:nth-child(1) .icon {
		animation-name: blink1;
		animation-duration: .5s;
		animation-delay: 2.9s;
	}
	.row:nth-child(2) .icon {
		animation-name: blink2;
		animation-duration: .6s;
    animation-delay: 2.8s;		
	}
	.row:nth-child(3) .icon {
		animation-name: blink1;
		animation-duration: .3s;
		animation-delay: 3.1s;
	}
	@keyframes blink1 {
		0% {opacity: 0}
		7% {opacity: .2}
		23% {opacity: .4}
		27% {opacity: 1}
		38% {opacity: .5}
		52% {opacity: .3}
		59% {opacity: .5}
		66% {opacity: .5}
		83% {opacity: .2}
		95% {opacity: .3}
		100% {opacity: 1}
	}
	@keyframes blink2 {
		0% {opacity: 0}
		16% {opacity: .1}
		25% {opacity: .3}
		28% {opacity: .1}
		42% {opacity: .2}
		49% {opacity: 1}
		55% {opacity: .3}
		60% {opacity: 1}
		91% {opacity: .5}
		99% {opacity: .3}
		100% {opacity: 1}
	}
	@keyframes blink3 {
		0% {opacity: 0}
		15% {opacity: 0}
		25% {opacity: 0}
		26% {opacity: .2}
		62% {opacity: .4}
		63% {opacity: .1}
		70% {opacity: .5}
		72% {opacity: .2}
		91% {opacity: .5}
		95% {opacity: .3}
		100% {opacity: 1}
	}
</style>
<div>
	{#each links as { icon, text, href }}
	<div class="row"><span class="icon">{@html icon}</span> <Typewriter><a href="{href}">{text}</a></Typewriter></div>
	{/each}
</div>