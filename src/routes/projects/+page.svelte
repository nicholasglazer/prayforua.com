<script>
 import {t} from '$stores/l10nStore';
 import CardsFallback from '$components/CardsFallback.svelte';
 import {getMaxCharacters} from '$lib/utils/maxChar';
 export let data;
</script>

<div class="bg-base8 flex flex-col w-full items-center">
    <div class="flex flex-1 flex-col items-center w-4xl max-w-4xl">
        <h1 class="font-bold text-lg text-left w-full m-8">{$t('projects.all')}</h1>
        {#await data.querySnapshot}
            <CardsFallback />
        {:then items}
            <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10 w-full">
                {#each items.docs as item}
                    {#if item.data().isPublic && !item.data().isCompleted}
                        <a href="projects/{item.id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full">
                            <figure>
                                <img src="{item.data().imageCover}" alt="image link is broken" />
                            </figure>
                            <div class="card-body overflow-hidden">
                                <h2 class="card-title">{item.data().name}</h2>
                                <p class="max-h-[116px]">{getMaxCharacters(150, item.data().description, false)}...</p>

                                {#await data.userSnap(item.data().creatorId)}
                                    <div class="flex h-8 justify-end pr-1">
                                        <span class="loading loading-ring loading-md"></span>
                                    </div>
                                {:then user}
                                    <div class="flex h-8 justify-end">
                                        <a href="/user/{item.data().creatorId}">
                                            <div class="w-8 mask mask-circle">
                                                <img alt="avatar" src={user.data().google.profile?.picture} />
                                            </div>
                                        </a>
                                    </div>
                                {:catch error}
                                    <p style="color: red">{error.message}</p>
                                {/await}
                            </div>
                        </a>
                    {/if}
                {/each}
            </div>
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
    {#if data.project?.isCompleted}
    <div class="flex flex-1 flex-col items-center w-4xl max-w-4xl">
        <h1 class="font-bold text-lg text-left w-full m-8">{$t('projects.completed')}</h1>
        {#await data.querySnapshot}
            <CardsFallback />
        {:then items}
            <div class="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-2 mb-10 w-full">
                {#each items.docs as item}
                    {#if item.data().isPublic && item.data().isCompleted}
                        <a href="projects/{item.id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full">
                            <figure>
                                <img src="{item.data().imageCover}" alt="image link is broken" />
                            </figure>
                            <div class="card-body overflow-hidden">
                                <h2 class="card-title">{item.data().name}</h2>
                                <p class="max-h-[116px]">{item.data().description}</p>

                                {#await data.userSnap(item.data().creatorId)}
                                    <div class="flex h-8 justify-end pr-1">
                                        <span class="loading loading-ring loading-md"></span>
                                    </div>
                                {:then user}
                                    <div class="flex h-8 justify-end">
                                        <a href="/user/{item.data().creatorId}">
                                            <div class="w-8 mask mask-circle">
                                                <img alt="avatar" src={user.data().google.profile?.picture} />
                                            </div>
                                        </a>
                                    </div>
                                {:catch error}
                                    <p style="color: red">{error.message}</p>
                                {/await}
                            </div>
                        </a>
                    {/if}
                {/each}
            </div>
        {:catch error}
            <p style="color: red">{error.message}</p>
        {/await}
    </div>
    {/if}
</div>
