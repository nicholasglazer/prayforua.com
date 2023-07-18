<script>
 import {auth} from '$stores/authStore';
 import {t} from '$stores/l10nStore';
 import {checkLink} from '$lib/utils/checkLink';
 import {socialIcons} from '$lib/utils/checkLink';
 $: user = $auth.user;
</script>

<div class="w-full my-8">
    <div class="flex justify-between">
        <div class="flex flex-col flex-1">
            <div class="flex mb-1">
                <h3 class="text-2xl font-bold mr-1.5">
                    {user.firstName ?? 'User'}
                </h3>
                <h3 class="text-2xl font-bold">
                    {user.lastName ?? ''}
                </h3>
            </div>
            <small class="font-semibold text-sm">
                {$auth.google.profile?.email ?? 'useremail@examaple.com'}
            </small>
            <small class="font-semibold">
                {user.occupation ?? ''}
            </small>
            <div class="flex mb-1.5">
                <small class="font-semibold">
                    {user.city ?? ''}
                </small>
                <small class="font-semibold">
                    {#if user.country}
                        ,
                    {/if}
                    {user.country ?? ''}
                </small>
            </div>
            <div class="max-w-lg">
                {user.bio ?? 'Your bio...'}
            </div>
        </div>
        <div class="flex flex-wrap flex-initial justify-center items-center w-[100px]">
            {#if $auth.isAuthenticated}
                <div class="avatar">
                    <div class="w-20 mask mask-circle">
                        <img alt="" src={$auth.google.profile?.picture} />
                    </div>
                </div>
            {:else}
                <div class="avatar">
                    <div class="w-20 h-20 mask mask-circle">
                        <div class="bg-base5 w-full h-full"></div>
                    </div>
                </div>
            {/if}
            <div class="flex">
                <a class="btn btn-ghost btn-xs mt-2 btn-outline" href="/user/edit">
                    {$t('user.edit')}
                </a>
            </div>
        </div>
    </div>
    <div class="flex justify-between mt-4">
        {#if user.website}
            <a class="text-base4 text-sm" target="_blank" href="{user.website}">
                {user.website ?? ''}
            </a>
        {/if}
        <div class="flex">
            {#each Object.entries(user.social) as s (s[0])}
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
