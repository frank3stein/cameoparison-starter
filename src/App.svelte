<script>
	import Welcome from "./screens/Welcome.svelte"
	let state = "welcome";
</script>

<main>
	{#if state=== "welcome"}
		<Welcome/>
	{:else if state==="playing"}
		<p>Game screen goes here</p>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 800px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>