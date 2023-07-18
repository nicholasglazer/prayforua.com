<script>
 import {auth} from '$stores/authStore';
 import {project} from '$stores/projectStore';
 import {t} from '$stores/l10nStore';
 import {countryList} from '$lib/data/countries'
 import {goto} from '$app/navigation';
 import {socialIcons} from '$lib/utils/socialIcons';

 export let data;

 function removeProject() {
     project.removeProject(data.slug);
     goto('/user');
 }

 $: socialInputVisibility = {};

 function showSocialInput(index) {
     socialInputVisibility[index] = true;
 }
</script>

<div class="w-full max-w-xl m-8 flex items-center justify-between">
    <small class="mr-4 font-semibold">
        {$t('user.project.editState')}
    </small>

    <a class="btn btn-ghost btn-outline btn-sm" href="/projects/{data.slug}">
        {$t('user.project.backBtn')}
    </a>
</div>

<div class="w-full max-w-xl bg-base8 shadow mb-8 p-4">
    <div class="flex max-md:flex-col md:items-center justify-between">
        <span class="font-bold text-sm">
            {$project.projects[data.slug]?.isPublic ? $t('user.project.settings.publishStatusPublicDescription') : $t('user.project.settings.publishStatusDraftDescription')}
        </span>
    </div>
    <div class="divider" />
    <div class="flex max-md:flex-col md:items-center justify-between">
        <span class="font-bold font-sm">
            {$t('user.project.settings.publishStatus')}:
        </span>
        <kbd id="flow-address-settings" class="kbd mb-2.5 px-2">
            {$project.projects[data.slug]?.isPublic ? $t('user.project.settings.publishStatusPublished') : $t('user.project.settings.publishStatusDraft')}
        </kbd>
    </div>

    {#if !$project.projects[data.slug]?.isPublic}
        <div class="flex max-md:flex-col md:items-center justify-between mt-2">
            <span class="font-bold font-sm">
                {$t('user.project.settings.publishBtnDescription')}
            </span>
            <button class="btn bg-base6 hover:bg-green hover:bg-base1" on:click={() => project.updateCurrentProject({isPublic: true}, data.slug)}>
                {$t('user.project.settings.publishBtn')}
            </button>
        </div>
    {/if}
</div>

<div class="w-full max-w-xl bg-base8 shadow mb-8 p-4">
    <div class="flex flex-col">
        <label for="project-name" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.project.title')}</label>
        <input id="project-name" bind:value="{data.project.title}" on:input="{(e) => project.updateCurrentProject({name: e.target.value}, data.slug)}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="project-cover" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.createProject.imageCover')}</label>
        <input id="project-cover" bind:value="{data.project.imageCover}" on:input="{(e) => project.updateCurrentProject({imageCover: e.target.value}, data.slug)}" placeholder="https://..." type="text" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="project-country" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.project.country')}</label>
        <select id="project-country" bind:value="{data.project.country}" on:change="{(e) => project.updateCurrentProject({country: e.target.value}, data.slug)}" class="select select-bordered select-sm w-full">
            {#each countryList as country}
                <option value={country}>
                    {country}
                </option>
            {/each}
        </select>
    </div>
    <div class="flex flex-col">
        <label for="project-city" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.project.city')}</label>
        <input id="project-city" bind:value="{data.project.city}" on:input="{(e) => project.updateCurrentProject({city: e.target.value}, data.slug)}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="project-website" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.project.website')}</label>
        <input id="project-website" bind:value="{data.project.website}" on:input="{(e) => project.updateCurrentProject({website: e.target.value}, data.slug)}" placeholder="https://..." type="text" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="project-description" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.project.description')}</label>
        <textarea id="project-description" bind:value="{data.project.description}" on:input="{(e) => project.updateCurrentProject({description: e.target.value}, data.slug)}" placeholder="" class="textarea textarea-bordered font-bold textarea-md w-full" />
    </div>
</div>

<div class="w-full max-w-xl bg-base8 shadow mb-8 p-4">
    <div class="flex max-md:flex-col md:items-center justify-between">
        <span class="font-bold">
            {$t('user.project.settings.donatations')}
        </span>
    </div>
    <div class="divider" />



    {#if !$project.projects[data.slug]?.isPublic}
        <div class="flex flex-col">
            <label for="create-project-goal" class="text-sm font-bold mt-2.5 mb-1.5">{$t('user.createProject.goal')}</label>
            <input id="create-project-goal" min="0" max="100000" bind:value="{data.project.goal}" on:input="{(e) => project.updateCurrentProject({goal: e.target.value}, data.slug)}" class="range range-primary mb-1" />
            <input id="create-project-goal" type="range" min="0" max="100000" bind:value="{data.project.goal}" on:input="{(e) => project.updateCurrentProject({goal: e.target.value}, data.slug)}" class="range range-primary" />
        </div>
    {/if}
    <div class="flex flex-col align-center w-full mt-2">
        <label for="flow-address-settings" class="font-bold text-sm mb-1">
            {$t('user.project.goal')}
        </label>
        <div class="flex items-baseline">
            <kbd id="flow-address-settings" class="kbd mb-2.5 w-fit">
                {data.project.goal} Flow
            </kbd>
            <div class="mx-2 h-5">
                ~
            </div>
            <kbd id="flow-address-settings" class="kbd mb-2.5 w-fit">
                {Math.floor(data.project.goal * 0.63)} $
            </kbd>
        </div>
    </div>
    <div class="flex max-md:flex-col md:items-center justify-between">
        <div class="flex flex-col align-center w-full">
            <label for="flow-address-settings" class="font-bold text-sm mb-1">
                {$t('user.project.settings.address')}
            </label>
            <kbd id="flow-address-settings" class="kbd max-md:mb-2.5">
                {$auth.flow?.user?.addr}
            </kbd>
        </div>
    </div>
</div>

<div class="w-full max-w-xl bg-base8 shadow mt-0 m-8 p-4 py-8">
    {#each Object.entries(data.project.links) as s, index (s[0])}
        {#if socialIcons[s[0]]}
            <div class="flex items-center">
                <div class="w-5">
                    <svelte:component this={socialIcons[s[0]]} />
                </div>
                <span class="mx-2 text-sm font-bold w-32">
                    {s[0]}
                </span>
                {#if socialInputVisibility[index] || s[1] !== ''}
                    <input bind:value="{data.project.links[s[0]]}" on:input="{(e) => project.updateCurrentProject({links: {[s[0]]: e.target.value}}, data.slug)}" type="text" placeholder="https://" class="input input-bordered input-sm font-bold w-full" />
                {:else}
                    <button class="btn btn-sm btn-accent ml-auto mr-8" on:click="{() => showSocialInput(index)}">{$t('user.edit.link')}</button>
                {/if}
            </div>
            {#if index !== Object.entries(data.project.links).length - 1}
                <div class="divider" />
            {/if}
        {/if}
    {/each}
</div>

<div class="w-full max-w-xl bg-base8 shadow mb-8 p-4">
    <div class="flex max-md:flex-col md:items-center justify-between">
        <span class="font-bold font-sm">
            {$t('user.project.settings.deleteBtnDescription')}
        </span>
        <button class="btn bg-red hover:bg-base1 text-base8" on:click={() => removeProject()}>
            {$t('user.project.settings.deleteBtn')}
        </button>
    </div>
</div>
