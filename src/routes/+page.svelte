<script>
 import {onMount} from 'svelte';
 import {auth} from '$stores/authStore';
 import F6 from '$lib/assets/parallax/F0.png';
 import F0 from '$lib/assets/parallax/F1.png';
 import F1 from '$lib/assets/parallax/F2.png';
 import F2 from '$lib/assets/parallax/F3.png';
 import F3 from '$lib/assets/parallax/F4.png';
 import F4 from '$lib/assets/parallax/F5.png';
 import F5 from '$lib/assets/parallax/F6.png';
 import '../styles/app.css';

 onMount(() => auth.useLocalStorage());

 const ls = [
     [0, F6, 100, 0, 0],
     [1, F0, 99, 0, 0],
     [2, F1, 98, 0, 0],
     [3, F2, 97, 0.01, 2.4],
     [4, F3, 96, 0.013, 3],
     [5, F4, 95, 0.021, 5],
     [6, F5, 94, 0.03, 6],
 ];

 let innerWidth;
 let innerHeight;
 let y;
 let x;
 let scale = 1;
 let containerWidth = 100;

 const scalingSteps = 100;
 let scrollingFactor = 0.1;

 $: {
     const scrollDistance = y * scrollingFactor;
     y = scrollDistance;
     if (y <= 400) {
         const scalingFactor = y / 200;
         scale = 1 + smoothstep(0, 1, scalingFactor, scalingSteps) * 0.5;
     } else if (y > 400) {
         scale = 1.14;
     } else {
         scale = 1;
     }
 }

 function smoothstep(min, max, factor, steps) {
     const x = Math.max(0, Math.min(1, (factor - min) / (max - min)));
     const smoothStepValue = x * x * x * (x * (x * 6 - 15) + 10);
     return Math.round(smoothStepValue * steps) / steps;
 }

 $: {
     if (innerWidth >= 1920) {
         containerWidth = 100;
     } else if (innerWidth <= 360) {
         containerWidth = 400;
     } else {
         const ratio = (innerWidth - 360) / (1920 - 360);
         containerWidth = 400 - Math.floor(ratio * 300);
     }
 }

</script>

<svelte:window bind:innerWidth bind:innerHeight bind:scrollY={y} on:mousemove={e => x = e.clientX} />

<main style="background: #14232A;">
    <div on:click={auth.googleSignIn}>{$auth?.user.name || "Sign in"}</div>
    <div class="parallax-container" style="width: {containerWidth}%">
        {#each ls as l}
            <img
                style="z-index: {l[2]};transform: translate({(x - innerWidth / 2) * l[0] / (ls.length - 1) * l[3]}px,{y * l[4] / (ls.length - 1) * 1}px); scale: {scale};"
                src="{l[1]}"
                alt="parallax layer {l[0]}"
            >
        {/each}
    </div>

    <div class="text">
        <span style="opacity: {1 - Math.max(0, y / 40)}">
            scroll down
        </span>
        <div class="foreground">
            Why donations matters?
        </div>
    </div>
</main>
<style>
 .parallax-container {
     position: fixed;
     height: 100%;
     left: 50%;
     transform: translate(-50%,0);
 }

 .parallax-container img {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     object-fit: cover;
     object-position: center;
     will-change: transform;
 }

 .text {
     position: relative;
     width: 100%;
     height: 300vh;
     color: var(--orange);
     text-align: right;
     padding-right: 10vh ;
     padding-top: 2em;
     box-sizing: border-box;
     pointer-events: none;
 }

 span {
     display: block;
     font-size: 1em;
     text-transform: uppercase;
     will-change: transform, opacity;
 }

 .foreground {
     position: sticky;
     top: 711px;
     left: 400px;
     width: 100%;
     height: calc(100% - 942px);
     color: var(--blue);
     font-weight: 700;
     font-size: 20px;
     text-transform: uppercase;
 }
</style>
