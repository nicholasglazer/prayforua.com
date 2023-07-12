<script>
 export let data;
</script>

<div class="mt-8">
    {#if data}
        <div>
            {data}
        </div>
    {:else}
        <h3 class="font-bold">
            No interactions yet!
        </h3>
    {/if}
</div>
