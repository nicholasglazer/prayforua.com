<script>
 export let items = [];
 export let activeTabValue = 1;

 const handleClick = tabValue => () => (activeTabValue = tabValue);
</script>

<div class="tabs">
    {#each items as item}
        <a class="tab flex-1 tab-bordered {activeTabValue === item.value ? 'tab-active' : ''}" on:click={handleClick(item.value)}>
            {item.label}
        </a>
    {/each}
</div>
{#each items as item}
    {#if activeTabValue == item.value}
        <div class="box w-full flex flex-col">
            <svelte:component this={item.component}/>
        </div>
    {/if}
{/each}

<style>

.tabs {
  @apply w-full;
}

</style>
