<script>
 import {onMount} from 'svelte';
 import {doc, onSnapshot} from 'firebase/firestore';
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import {checkLink} from '$lib/utils/checkLink';
 import {socialIcons} from '$lib/utils/socialIcons';
 import CogIcon from '$components/icons/Cog.svelte';
 import LocIcon from '$components/icons/Loc.svelte';
 import DonateModal from '$components/DonateModal.svelte';
 import ReadMore from '$components/ReadMore.svelte';
 import {getAccountBalance} from '$lib/flow/actions';

 export let data;

 let projectBalance = null;

 onMount(async () => {
     const docRef = doc(data.db, 'users', data.project?.creatorId);
     onSnapshot(docRef, (snapshot) => {
         if (snapshot.data().flow.balance !== undefined) {
             projectBalance = snapshot.data().flow.balance
             getAccountBalance($auth.flow?.user?.addr, $auth.user.id, true);
         }
     });
 });

 $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<div class="flex flex-col w-full items-center" style="min-height: {innerHeight - 64}px">
    <div class="flex flex-col w-2xl max-w-2xl mt-12">
        <h3 class="text-2xl font-bold">{data.project.title} {$t('project.by')} {data.creator?.user?.firstName} {data.creator?.user?.lastName}</h3>
        <ReadMore textContent={data.project.description} maxChars={135} />
    </div>
    <div class="flex">
        <div class="flex flex-col flex-1 mr-10">

        </div>
    </div>

    <div class="max-w-2xl">
        <img src="{data.project?.imageCover}" alt="image link is broken" />
    </div>

    <div class="flex max-w-2xl w-full items-center justify-between">
        <div class="flex items-center">
            {#if data.project.city || data.project.country}
                {#if data.project.country}
                    <LocIcon />
                    <span>
                        {data.project.country},
                    </span>
                {/if}
                {#if data.project.city}
                    <span>
                        {data.project.city}
                    </span>
                {/if}
            {/if}
        </div>
        <div class="flex justify-end">
            {#if data.project.website}
                <a class="text-base4 text-sm" target="_blank" href="{data.project.website}">
                    {data.project.website ?? ''}
                </a>
            {/if}
            <div class="flex ml-2">
                {#each Object.entries(data.project.links) as s (s[0])}
                    {#if s[1]}
                        <div class="flex items-center">
                            <a href="{checkLink(s[1])}" target="_blank" class="w-5 mr-1">
                                <svelte:component this={socialIcons[s[0]]} />
                            </a>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
    <div class="divider"></div>
    <div class="max-md:w-full">
        <progress class="progress progress-error max-md:w-full max-md:px-2 md:w-[600px]" value="{data.creator?.flow?.balance}" max="{data?.project?.goal}"></progress>
    </div>
    <div class="stats max-md:stats-vertical mb-8 bg-primary text-primary-content max-md:w-full md:w-[600px]">
        <div class="stat">
            <div class="stat-title pb-3">Donated</div>
            <div class="stat-value">
                {#if projectBalance ?? null}
                    {Number(projectBalance).toFixed(3)} Flow
                {:else}
                    <span class="loading loading-infinity loading-lg"></span>
                {/if}
            </div>
            <div class="stat-actions">
                <button class=""></button>
            </div>
        </div>
        <div class="stat">
            <div class="stat-title">of requested</div>
            <div class="stat-value">
                {data.project?.goal} Flow
            </div>
            <div class="stat-actions">
            </div>
        </div>

        {#if !data.project?.isCompleted}
            {#if data.project?.creatorId !== $auth.user?.id}
                <div class="flex items-center pl-4 mr-4">
                    {#if $auth.flow?.user?.addr}
                        <DonateModal projectData={data}/>
                    {:else}
                        {@html $t('user.edit.flowNotConnected')}
                    {/if}
                </div>
            {:else}
                <div class="flex items-center justify-center">
                    <a href="{data.slug}/edit" class="p-4">
                        <CogIcon />
                    </a>
                </div>
            {/if}
        {/if}
    </div>
</div>
