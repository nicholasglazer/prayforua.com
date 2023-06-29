<script>
 import {locale, locales} from '$stores/l10nStore';
 export let isIcon;
</script>

<select bind:value={$locale} class="select select-ghost w-full max-w-[204px]">
    {#each locales as l}
        <option value={l[0]}>{isIcon ? l[2] : l[1]}</option>
    {/each}
</select>

<style>
 .select {
     @apply p-0 pl-2;
 }
</style>
