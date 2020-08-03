<script>
	import {onMount} from 'svelte'
	import Welcome from "./screens/Welcome.svelte"
	import {select} from "./select.js"
	
	let state = "welcome"; 
	let selection
	let celebsPromise;
	const start = async (e) => {
		const {celebs, lookup} = await celebsPromise;

		selection = select(celebs, lookup, e.detail.category.slug)
		state = "playing"
	}
	const loadCelebs = async () => {
		const res = await fetch("https://cameo-explorer.netlify.app/celebs.json")
		const data = await res.json();

		const lookup = new Map()

		data.forEach(c=> {
			lookup.set(c.id, c)
		})

		const subset = new Set()
		data.forEach(c=> {
			if (c.reviews >= 50) {
				subset.add(c);
				c.similar.forEach(id=>{
					subset.add(lookup.get(id))
				})
			}
		})

		return {
			celebs: Array.from(subset),
			lookup
		}

		console.log(data);
	}
	onMount(()=>{
		celebsPromise = loadCelebs()
	})
</script>

<main>
	{#if state=== "welcome"}
		<Welcome on:select={start}/>
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