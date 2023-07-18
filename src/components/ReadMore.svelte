<script>
 import {getMaxCharacters} from '$lib/utils/maxChar';

 export let maxChars;
 export let textContent;
 export let readMore = '...Show full';
 export let readLess = 'Hide description';

 let isOpen = false;

 const trimmed = textContent.replace(/\s+/g, ' ').trim();

 $: showLabel = isOpen ? readLess : readMore;
 $: maxCharsText = getMaxCharacters(maxChars, trimmed, isOpen);
</script>

<div class="m-4 text-base4">
    <span>
        {maxCharsText}
    </span>
    <div on:click={() => (isOpen = !isOpen)} class="hover:underline text-blue whitespace-nowrap text-end">
        {showLabel}
    </div>
</div>
