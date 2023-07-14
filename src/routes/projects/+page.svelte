<script>
 import {t} from '$stores/l10nStore';
 import CardsFallback from '$components/CardsFallback.svelte';
 export let data;
 console.log('datai nprojet', data)
 console.log('l', Object.entries(data.projects).length)
</script>


<div class="bg-base8 flex w-full justify-center">
    <div class="flex flex-1 flex-col items-center w-2xl max-w-2xl">
        <h1 class="font-bold text-lg text-left w-full m-8">{$t('projects.all')}</h1>
        {#if Object.entries(data.projects).length}
            <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10 w-full">
                {#each Object.entries(data.projects) as p (p[0])}
                    <a href="projects/{p[1].project.id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full">
                        {#if p[1].project.coverImage}
                            <figure>
                                <img src="{p[1].project.coverImage}" alt="image link is broken" />
                            </figure>
                        {/if}
                        <div class="card-body">
                            <h2 class="card-title">{p[1].project.name || p[1].project.id}</h2>
                            {#if p[1].project.description}
                                <p>{p[1].project.description}</p>
                            {/if}
                            <div class="card-actions justify-end">
                                <a href="projects/{p[1].project.id}/edit" class="btn btn-ghost btn-xs btn-outline">{$t('user.project.edit')}</a>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {:else}
            <CardsFallback />
        {/if}
    </div>
</div>
