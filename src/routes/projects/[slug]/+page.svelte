<script>
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import CogIcon from '$components/icons/Cog.svelte';
 import DonateModal from '$components/DonateModal.svelte';
 import ReadMore from '$components/ReadMore.svelte';
 export let data;

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
            <div>
                <progress class="progress progress-error w-56" value="{data.creator?.flow?.balance}" max="{data?.project?.goal}"></progress>
                <h1 class="font-bold text-2xl text-peach mt-2">
                    {data.creator?.flow?.balance}
                </h1>
                <div>
                    donated of {data.project?.goal} Flow
                </div>
                <div class="divider my-2"/>

                {#if data.creator?.user.id !== $auth.user?.id}
                    {#if $auth.flow.user.addr}
                        <DonateModal projectData={data}/>
                    {/if}
                {/if}
            </div>
            <div class="flex justify-between">
                {#if data.creator?.user.id === $auth.user?.id}
                    <a href="{data.slug}/edit" class="">
                        <CogIcon />
                    </a>
                {/if}
            </div>
        </div>
        <div class="flex-3">
            <div class="max-w-[600px]">
                <img src="{data.project?.imageCover}" alt="image link is broken" />
            </div>
        </div>
    </div>
    <div class="divider"></div>
</div>
