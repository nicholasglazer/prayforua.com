<script>
 import {auth} from '$stores/authStore';
 import {t} from '$stores/l10nStore';
 import {countryList} from '$lib/data/countries';
 import {sendProfileQuery, initFlowProfile, mutateFlowProfile} from '$lib/flow/actions'
 import {socialIcons} from '$lib/utils/socialIcons';

 $: socialInputVisibility = {};

 function showSocialInput(index) {
     socialInputVisibility[index] = true;
 }
 function updateUserBaseProfile(v) {
     auth.updateUserBaseProfile(v);
 }
 function updateUserLinks(v) {
     auth.updateUserLinks(v);
 }
 function updateFlowProfile(v) {
     auth.updateFlowProfile(v);
 }
</script>

<div class="w-full max-w-xl mt-8 mb-2 flex">
    <small class="mr-4 font-semibold">
        {$t('user.edit.editState')}
    </small>
    <a class="btn btn-ghost btn-outline btn-sm" href="/user">
        {$t('user.edit.backBtn')}
    </a>
</div>
<div class="w-full max-w-xl bg-base8 shadow m-8 p-4">
    <div class="flex max-md:flex-col">
        <div class="flex flex-col md:pr-2 flex-1">
            <label for="first-name" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.firstName')}</label>
            <input id="first-name" bind:value="{$auth.user.firstName}" on:input="{(e) => updateUserBaseProfile({firstName: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
        </div>
        <div class="flex flex-col flex-1">
            <label for="last-name" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.lastName')}</label>
            <input id="last-name" bind:value="{$auth.user.lastName}" on:input="{(e) => updateUserBaseProfile({lastName: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
        </div>
    </div>
    <div class="flex flex-col">
        <label for="occupation" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.occupation')}</label>
        <input id="occupation" bind:value="{$auth.user.occupation}" on:input="{(e) => updateUserBaseProfile({occupation: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="country" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.country')}</label>
        <select bind:value="{$auth.user.country}" on:change="{(e) => updateUserBaseProfile({country: e.target.value})}" id="country" class="select select-bordered select-sm w-full">
            {#each countryList as country}
                <option value={country}>
                    {country}
                </option>
            {/each}
        </select>
    </div>
    <div class="flex flex-col">
        <label for="city" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.city')}</label>
        <input id="city" bind:value="{$auth.user.city}" on:input="{(e) => updateUserBaseProfile({city: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="website" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.website')}</label>
        <input id="website" bind:value="{$auth.user.website}" on:input="{(e) => updateUserBaseProfile({website: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
    </div>
    <div class="flex flex-col">
        <label for="bio" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.bio')}</label>
        <!-- <input  type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" /> -->
        <textarea id="bio" bind:value="{$auth.user.bio}" on:input="{(e) => updateUserBaseProfile({bio: e.target.value})}" placeholder="" class="textarea textarea-bordered font-bold textarea-md w-full" />
    </div>
</div>

<div class="w-full max-w-xl bg-base8 shadow mt-0 m-8 p-4 py-8">
    {#each Object.entries($auth.user.social) as s, index (s[0])}
        {#if socialIcons[s[0]]}
            <div class="flex items-center">
                <div class="w-5">
                    <svelte:component this={socialIcons[s[0]]} />
                </div>
                <span class="mx-2 text-sm font-bold w-32">
                    {s[0]}
                </span>
                {#if socialInputVisibility[index] || s[1] !== ''}
                    <input bind:value="{s[1]}" on:input="{(e) => updateUserLinks({[s[0]]: e.target.value})}" type="text" placeholder="https://" class="input input-bordered input-sm font-bold w-full" />
                {:else}
                    <button class="btn btn-sm btn-accent ml-auto mr-8" on:click="{() => showSocialInput(index)}">{$t('user.edit.link')}</button>
                {/if}
            </div>
            <div class="divider" />
        {/if}
    {/each}
</div>

<div class="w-full max-w-xl bg-base8 shadow mt-0 m-8 p-4 py-8">
    {#if $auth.flow?.user.addr}
        <a href="https://testnet.flowscan.org/account/{$auth.flow?.user?.addr}" target="_blank">
            <kbd id="flow-address-settings" class="kbd w-full mb-4">
                {$auth.flow?.user?.addr}
            </kbd>
        </a>
        {#if $auth.flow.flowProfileStatus !== 4}
            <div class="flex justify-between">
                <label for="load-flow-profile" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.flowCreateProfileDescription')}:</label>
                <button class="btn btn-sm btn-accent" on:click="{initFlowProfile}">{$t('user.edit.flowCreateProfile')}</button>
            </div>
        {/if}
        {#if $auth.flow.flowProfileStatus === 4 && !$auth.flow.profile?.name}
            <div class="flex justify-between">
                <label for="load-flow-profile" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.flowLoadProfileDescription')}:</label>
                <button id="load-flow-profile" class="btn btn-sm btn-accent" on:click="{sendProfileQuery($auth.flow?.user.addr)}">{$t('user.edit.flowLoadProfile')}</button>
            </div>

        {/if}

        {#if $auth.flow.flowProfileStatus === 4 && $auth.flow.profile?.name}
            <div class="flex max-md:flex-col">
                <div class="flex flex-col md:pr-2 flex-1">
                    <label for="flow-name" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.flowName')}</label>
                    <input id="flow-name" bind:value="{$auth.flow.profile.name}" on:input="{(e) => updateFlowProfile({name: e.target.value})}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
                </div>
                <div class="flex flex-col flex-1">
                    <label for="flow-color" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.flowColor')}</label>
                    <input id="flow-color" bind:value="{$auth.flow.profile.color}" on:input="{(e) => updateFlowProfile({color: e.target.value})}" type="color" placeholder="" class="input input-bordered input-sm font-bold w-full" />
                </div>
            </div>
            <div class="flex flex-col">
                <label for="flow-bio" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.edit.flowBio')}</label>
                <textarea id="flow-bio" bind:value="{$auth.flow.profile.info}" on:input="{(e) => updateFlowProfile({info: e.target.value})}" placeholder="" class="textarea textarea-bordered font-bold textarea-md w-full" />
            </div>


            <button class="btn btn-sm bg-green ml-auto mt-4 ml-auto" on:click="{mutateFlowProfile}">{$t('user.edit.flowUpdateProfile')}</button>
        {/if}
    {:else}
        <div class='text-center'>
            {@html $t('user.edit.flowNotConnected')}
        </div>
    {/if}
</div>
