<script>
  import { onMount } from "svelte";
  import Welcome from "./screens/Welcome.svelte";
  import Game from "./screens/Game.svelte";
  import { select } from "./select.js";
  import { loadImage } from "./utils";

  let state = "welcome";
  let selection;
  let celebsPromise;
  const loadCelebs = async () => {
    const res = await fetch("https://cameo-explorer.netlify.app/celebs.json");
    const data = await res.json();

    const lookup = new Map();

    data.forEach((c) => {
      lookup.set(c.id, c);
    });

    const subset = new Set();
    data.forEach((c) => {
      if (c.reviews >= 50) {
        subset.add(c);
        c.similar.forEach((id) => {
          subset.add(lookup.get(id));
        });
      }
    });

    return {
      celebs: Array.from(subset),
      lookup,
    };

    console.log(data);
  };
  onMount(() => {
    celebsPromise = loadCelebs();

    // kick start the loading of images

    loadImage("/icons/right.svg");
    loadImage("/icons/wrong.svg");
  });

  const start = async (e) => {
    const { celebs, lookup } = await celebsPromise;

    selection = select(celebs, lookup, e.detail.category.slug);
    state = "playing";
  };
</script>

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

<main>
  {#if state === 'welcome'}
    <Welcome on:select={start} />
  {:else if state === 'playing'}
    <Game
      {selection}
      on:restart={() => {
        state = 'welcome';
      }} />
  {/if}
</main>
