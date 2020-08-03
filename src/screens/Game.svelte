<script>
  import Card from "../components/Card.svelte";
  import { sleep, pick_random, loadImage } from "../utils";
  import { select_option } from "svelte/internal";
  import { fly, scale, crossfade } from "svelte/transition";
  import * as eases from "svelte/easing";
  import App from "../App.svelte";
  import { createEventDispatcher } from "svelte";
  import { elasticInOut, elasticOut } from "svelte/easing";

  export let selection;
  const dispatch = createEventDispatcher();

  const [send, receive] = crossfade({
    easing: eases.cubicOut,
    duration: 300,
  });

  const loadDetails = async (celeb) => {
    const res = await fetch(
      `https://cameo-explorer.netlify.app/celebs/${celeb.id}.json`
    );
    const details = await res.json();
    console.log("details", details);
    await loadImage(details.image);
    return details;
  };
  console.log("Selection ", selection);

  const promises = selection.map((round) =>
    Promise.all([loadDetails(round.a), loadDetails(round.b)])
  );
  let i = 0;
  let lastResult;
  let done = false;
  let ready = true; // we wait till the last round is over to render the new round
  const results = Array(selection.length);
  $: score = results.filter((x) => x === "right").length;
  const pickMessage = (p) => {
    if (p < 0.5)
      return pick_random([
        "Ouch",
        "That was not very good",
        "You must try harder",
      ]);
    if (p <= 0.8) return pick_random(["Not bad", "Keep Practicing"]);
    if (p < 1) return pick_random(["So close", "Almost there"]);
    return pick_random(["You rock", "Flawless victory!"]);
  };

  const submit = async (a, b, sign) => {
    lastResult = Math.sign(a.price - b.price) === sign ? "right" : "wrong";
    console.log({ lastResult });

    // wait for 1500ms
    await sleep(1500);
    results[i] = lastResult;
    lastResult = null;

    await sleep(500);
    if (i < selection.length - 1) {
      i += 1;
    } else {
      done = true;
    }
  };
</script>

<style>
  .game {
    display: grid;
    grid-template-rows: 1fr 2em 1fr;
    grid-gap: 0.5em;
    width: 100%;
    height: 100%;
    max-height: min(100%, 40vh);
    margin: 0 auto;
  }
  .game > div {
    display: flex;
    align-items: center;
  }
  .game-container {
    flex: 1;
  }

  .same {
    width: 100%;
    align-items: center;
    margin: 0;
  }

  .game .card-container button {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .error {
    color: red;
  }

  .giant-result {
    position: fixed;
    /* making square in the middle of the screen */
    width: 50vmin;
    height: 50vmin;
    left: calc(50vw - 25vmin);
    top: calc(50vh - 25vmin);
    opacity: 0.5;
  }

  .results {
    display: grid;
    grid-gap: 0.2em;
    width: 100%;
    max-width: 320px;
    margin: 1em auto 0 auto;
  }

  .result {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    padding: 0 0 100% 0;
    transition: background 0.2s;
    transition-delay: 0.2s;
  }

  .result img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .done {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .done strong {
    font-size: 6em;
    font-weight: 700;
  }
  @media (min-width: 640px) {
    .game {
      max-width: 100%;
      grid-template-rows: none;
      grid-template-columns: 1fr 8em 1fr;
      /* workaround safari */
      max-height: calc(100vh - 6em);
    }

    .same {
      height: 8em;
    }
  }
</style>

<header>
  <p>
    Tap on the more monetisable celebrity's face, or tap 'same price' if society
    values them equally.
  </p>
</header>

<div class="game-container">
  {#if done}
    <div
      class="done"
      in:scale={{ delay: 200, duration: 800, easing: elasticOut }}>
      <strong>{score}/{results.length}</strong>
      <p>{pickMessage(score / results.length)}</p>
      <button on:click={() => dispatch('restart')}>Back to main screen</button>
    </div>
  {:else if ready}
    {#await promises[i] then [a, b]}
      <div
        class="game"
        in:fly={{ duration: 200, y: 20 }}
        out:fly={{ duration: 200, y: -20 }}
        on:outrostart={() => (ready = false)}
        on:outroend={() => (ready = true)}>
        <div class="card-container">
          <Card
            celeb={a}
            on:select={() => submit(a, b, 1)}
            showPrice={!!lastResult}
            winner={a.price >= b.price} />
        </div>
        <div>
          <button class="same" on:click={() => submit(a, b, 0)}>
            same price
          </button>
        </div>
        <div class="card-container">
          <Card
            celeb={b}
            on:select={() => submit(a, b, -1)}
            showPrice={!!lastResult}
            winner={b.price >= a.price} />
        </div>
      </div>
    {:catch error}
      <p class="error">Something went wrong! {error}</p>
    {/await}
  {/if}
</div>

{#if lastResult}
  <!-- fly the  -->
  <img
    in:fly={{ x: 100, duration: 200 }}
    out:send={{ key: i }}
    src="/icons/{lastResult}.svg"
    alt="{lastResult} answer"
    class="giant-result" />
{/if}

<div
  class="results"
  style="grid-template-columns: repeat({results.length}, 1fr)">
  {#each results as result, i}
    <span class="result">
      {#if result}
        <img
          in:receive={{ key: i }}
          src="/icons/{result}.svg"
          alt="{result} answer" />
      {/if}
    </span>
  {/each}
</div>
