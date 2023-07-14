<script>
 import NewProjectModal from '$components/NewProjectModal.svelte';
 import CardsFallback from '$components/CardsFallback.svelte';
 import {t} from '$stores/l10nStore';
 import {project} from '$stores/projectStore';
</script>

<div class="mt-8 mb-4">
    <NewProjectModal />
</div>

{#if $project.currentProjectsStatus === false}
    <CardsFallback />
{/if}
{#if $project.currentProjectsStatus === true}
    <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10">
        {#each Object.entries($project.projects) as p (p[0])}
            <a href="projects/{p[1].id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full overflow-hidden whitespace-nowrap text-ellipsis">
                {#if p[1].coverImage}
                    <figure>
                        <img src="{p[1].coverImage}" alt="image link is broken" />
                    </figure>
                {/if}
                <div class="card-body">
                    <h2 class="card-title overflow-hidden whitespace-nowrap text-ellipsis">{p[1].name}</h2>
                    {#if p[1].description}
                        <p class="overflow-hidden whitespace-nowrap text-ellipsis">{p[1].description}</p>
                    {/if}
                    <div class="card-actions justify-end">
                        <a href="projects/{p[1].id}/edit" class="btn btn-ghost btn-xs btn-outline">{$t('user.project.edit')}</a>
                    </div>
                </div>
            </a>
        {/each}
    </div>
{/if}
{#if $project.currentProjectsStatus === null}
    <div class="w-full flex justify-center">
        Create your first project!
    </div>
{/if}
