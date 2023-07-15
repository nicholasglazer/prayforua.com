<script>
 import {auth} from '$stores/authStore';
 import {project} from '$stores/projectStore';
 import {t} from '$stores/l10nStore';
 import {countryList} from '$lib/data/countries'
 import InstagramIcon from '$components/icons/Instagram.svelte';
 import DiscordIcon from '$components/icons/Discord.svelte';
 import TwitterIcon from '$components/icons/Twitter.svelte';
 import LinkedinIcon from '$components/icons/Linkedin.svelte';
 import FacebookIcon from '$components/icons/Facebook.svelte';
 import YoutubeIcon from '$components/icons/Youtube.svelte';
 import GithubIcon from '$components/icons/Github.svelte';
 import TelegramIcon from '$components/icons/Telegram.svelte';


 export let data;

 console.log('data edit', data.project.name)
 $: socialInputVisibility = {};

 function showSocialInput(index) {
     socialInputVisibility[index] = true;
 }
 const socialIcons = {
     'Discord': DiscordIcon,
     'Facebook': FacebookIcon,
     'Github': GithubIcon,
     'Instagram': InstagramIcon,
     'Linkedin': LinkedinIcon,
     'Telegram': TelegramIcon,
     'Twitter': TwitterIcon,
     'Youtube': YoutubeIcon
 };
</script>

<div class="w-full max-w-xl mt-8 mb-2 flex items-center justify-between">
    <small class="mr-4 font-semibold">
        {$t('user.project.editState')}
    </small>

    <a class="btn btn-ghost btn-outline btn-sm" href="/projects/{data.slug}">
        {$t('user.project.backBtn')}
    </a>
</div>
<div class="w-full max-w-xl bg-base8 shadow m-8 p-4">
    <div class="flex flex-col">
        <label for="project-name" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.project.name')}</label>
        <input id="project-name" bind:value="{data.project.name}" on:input="{(e) => project.updateCurrentProject({name: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="project-description" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.project.description')}</label>
        <input id="project-description" bind:value="{data.project.description}" on:input="{(e) => project.updateCurrentProject({description: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="country" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.project.country')}</label>
        <select bind:value="{data.project.country}" on:change="{(e) => project.updateCurrentProject({country: e.target.value})}" id="country" class="select select-bordered select-sm w-full">
            {#each countryList as country}
                <option value={country}>
                    {country}
                </option>
            {/each}
        </select>
    </div>
    <div class="flex flex-col">
        <label for="city" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.city')}</label>
        <input id="city" bind:value="{data.project.city}" on:input="{(e) => project.updateCurrentProject({city: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="website" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.website')}</label>
        <input id="website" bind:value="{data.project.website}" on:input="{(e) => project.updateCurrentProject({website: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="bio" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.bio')}</label>
        <!-- <input  type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" /> -->
        <textarea id="bio" bind:value="{data.project.bio}" on:input="{(e) => project.updateCurrentProject({bio: e.target.value})}" placeholder="" class="textarea textarea-bordered font-bold textarea-md w-full" />
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
                    <input bind:value="{s[1]}" on:input="{(e) => project.updateCurrentProject({[s[0]]: e.target.value})}" type="text" placeholder="https://" class="input input-bordered input-sm font-bold w-full" />
                {:else}
                    <button class="btn btn-sm btn-accent ml-auto mr-8" on:click="{() => showSocialInput(index)}">{$t('user.edit.link')}</button>
                {/if}
            </div>
            <div class="divider" />
        {/if}
    {/each}
</div>

