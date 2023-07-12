<script>
 import NewProjectModal from '$components/NewProjectModal.svelte';
 import {t} from '$stores/l10nStore';
 import {project} from '$stores/projectStore';
 import {onMount} from 'svelte';


 onMount(() => {
     project.getCurrentProjects()
 });
 $: proj = $project.projects;
 console.log
</script>


<div class="mt-8 mb-4">
    <NewProjectModal />
</div>

{#if proj && !Object.entries(proj).length}
    <div class="animate-pulse grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10">
        {#each Array(3) as b}
            <div class="card bg-base6 shadow-sm image-full">
                <div class="card-body">
                    <h2 class="card-title h-5 w-[110px] bg-base7"></h2>
                    <div class="card-actions justify-end">
                        <p class="h-4 w-[50px] bg-base7"></p>
                        <p class="h-4 w-[50px] bg-base7"></p>
                    </div>
                    <div class="card-actions justify-end">
                        <p class="h-4 w-[50px] bg-base7"></p>
                    </div>
                    <div class="card-actions justify-end">
                        <p class="h-4 w-[50px]"></p>
                        <p class="h-4 w-[50px] bg-base7"></p>
                    </div>
                </div>
            </div>

        {/each}
    </div>
{:else if proj === null}
    <div>
        Create your first project!
    </div>
{:else}
    <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10">
        {#each Object.entries(proj) as p (p[0])}
            <a href="project/{p[1].id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full">
                {#if p[1].coverImage}
                    <figure>
                        <img src="{p[1].coverImage}" alt="image link is broken" />
                    </figure>
                {/if}
                <div class="card-body">
                    <h2 class="card-title">{p[1].name || p[1].id}</h2>
                    {#if p[1].description}
                        <p>{p[1].description}</p>
                    {/if}
                    <div class="card-actions justify-end">
                        <a href="project/{p[1].id}/edit" class="btn btn-ghost btn-xs btn-outline">{$t('user.project.edit')}</a>
                    </div>
                </div>
            </a>
        {/each}
    </div>
{/if}
