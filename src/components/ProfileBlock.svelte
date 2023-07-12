<script>
 import {auth} from '$stores/authStore';
 import {t} from '$stores/l10nStore';
 import InstagramIcon from '$components/icons/Instagram.svelte';
 import DiscordIcon from '$components/icons/Discord.svelte';
 import TwitterIcon from '$components/icons/Twitter.svelte';
 import LinkedinIcon from '$components/icons/Linkedin.svelte';
 import FacebookIcon from '$components/icons/Facebook.svelte';
 import YoutubeIcon from '$components/icons/Youtube.svelte';
 import GithubIcon from '$components/icons/Github.svelte';
 import TelegramIcon from '$components/icons/Telegram.svelte';
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
 const checkLink = (s) => {
     const regex = /^(http|https):\/\/.+/;
     if (!regex.test(s)) {
         return `https://${s}`;
     }
     return s;
 };
</script>

<div class="w-full my-8">
    <div class="flex justify-between">
        <div class="flex flex-col flex-1">
            <div class="flex mb-1">
                <h3 class="text-2xl font-bold mr-1.5">
                    {$auth.user.firstName ?? 'User'}
                </h3>
                <h3 class="text-2xl font-bold">
                    {$auth.user.lastName ?? ''}
                </h3>
            </div>
            <small class="font-semibold text-sm">
                {$auth.google.profile?.email ?? 'useremail@examaple.com'}
            </small>
            <small class="font-semibold">
                {$auth.user.occupation ?? ''}
            </small>
            <div class="flex mb-1.5">
                <small class="font-semibold">
                    {$auth.user.city ?? ''}
                </small>
                <small class="font-semibold">
                    {#if $auth.user.country}
                        ,
                    {/if}
                    {$auth.user.country ?? ''}
                </small>
            </div>
            <div class="max-w-lg">
                {$auth.user.bio ?? 'Your bio...'}
            </div>
        </div>
        <div class="flex flex-wrap flex-initial justify-center items-center w-[100px]">
            <div class="avatar">
                <div class="w-22 mask mask-circle">
                    <img alt="avatar" src={$auth.google.profile?.picture} />
                </div>
            </div>
            <div class="flex">
                <a class="btn btn-ghost btn-xs mt-2 btn-outline" href="/user/edit">
                    {$t('user.edit')}
                </a>
            </div>
        </div>
    </div>
    <div class="flex justify-between mt-4">
        {#if $auth.user.website}
            <a class="text-base4 text-sm" target="_blank" href="{$auth.user.website}">
                {$auth.user.website ?? ''}
            </a>
        {/if}
        <div class="flex">
            {#each Object.entries($auth.user.social) as s (s[0])}
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
