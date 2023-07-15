<script>
 import {t} from '$stores/l10nStore';
 import {project} from '$stores/projectStore';
 import CardsFallback from '$components/CardsFallback.svelte';
 export let data
 console.log(' p data', data)
 console.log(' p $projcet', $project.projects)
</script>

<div class="bg-base8 flex w-full justify-center">
    <div class="flex flex-1 flex-col items-center w-2xl max-w-2xl">
        <h1 class="font-bold text-lg text-left w-full m-8">{$t('projects.all')}</h1>
        {#await data.querySnapshot}
            <CardsFallback />
        {:then items}
            <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10 w-full">
                {#each items.docs as item}
                    <div>
                        {item.id}
                        {item.data().name}
                        {item.data().description}
                    </div>
                    <a href="projects/{item.id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full">
                        <figure>
                            <img src="{item.data().coverImage}" alt="image link is broken" />
                        </figure>
                        <div class="card-body overflow-hidden">
                            <h2 class="card-title">{item.data().name}</h2>
                            <p class="max-h-[116px]">{item.data().description}</p>
                        </div>
                    </a>
                {/each}
            </div>
         {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
</div>


{#if Object.entries($project.projects).length}
<div class="bg-base8 flex w-full justify-center">
    <div class="flex flex-1 flex-col items-center w-2xl max-w-2xl">
        <h1 class="font-bold text-lg text-left w-full m-8">{$t('projects.all')}</h1>
        <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10 w-full">
            {#each Object.entries($project.projects) as p (p[0])}
                <div>
                    {p[1].id}
                    {p[1].name}
                    {p[1].description}
                </div>
                <a href="projects/{p[1].id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full">
                    <figure>
                        <img src="{p[1].coverImage}" alt="image link is broken" />
                    </figure>
                    <div class="card-body overflow-hidden">
                        <h2 class="card-title">{p[1].name}</h2>
                        <p class="max-h-[116px]">{p[1].description}</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>
{/if}
