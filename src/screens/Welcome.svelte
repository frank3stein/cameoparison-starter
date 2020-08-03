    <header><h1 class="svelte-1fhxxll">
		CameoP<span class="logo svelte-1fhxxll">a</span>rison
	</h1> 

	<p class="svelte-1fhxxll">
		On <a href="https://cameo.com">cameo.com</a>, you can buy personalised video clips from everyone from Lindsay Lohan to Ice T.
	</p> 

    <p class="svelte-1fhxxll">But who commands the highest price?</p></header>
    
    <style>
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: min(12vw, 4em);
		font-weight: 100;
		margin: 0 0 0.5em 0;
	}
    p {
		max-width: 24em;
		margin: 0 auto 1em auto;
	}

	.logo {
		display: inline-block;
		background: url(/icons/compare.svg) 50% 50% no-repeat;
		background-size: 100% 100%;
		width: 0.8em;
		top: 0.05em;
		transform: scale(1.4);
		left: 0.02em;
		text-indent: -9999px;
	}

	.categories {
		width: 100%;
		max-width: 26em;
		margin: 0 auto;
	}

	button {
		padding: 1em;
		display: block;
		margin: 0 0 0.2em 0;
		width: 100%;
	}

	@media (min-width: 640px) {
		button {
			display: inline;
			margin: 0 0.2em 0.4em 0.2em;
			width: auto;
		}
	}

    </style>