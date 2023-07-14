<script>
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import isMobile from '$lib/utils/isMobile';
 import Drawer from '$components/Drawer.svelte';
 import IconMenu from '$components/IconMenu.svelte';
 import Locales from '$components/Locales.svelte';

 function signUser() {
     auth.googleSignIn();
 }
</script>

<header class="glass bglass sticky z-[200] shadow top-0 navbar px-4">
    {#if isMobile}
        <div class="flex-1">
            <Drawer />
        </div>
    {/if}
    <div class="flex-1 px-2 lg:flex-none">
        <a href="/" class="text-lg font-bold max-md:hidden">{$t('header.logo')}</a>
        <a href="/" class="md:hidden">
            <img src="/src/lib/assets/logo64.png" alt="" class="w-10 h-10" />
        </a>
    </div>
    <div class="ml-auto">
        <a href="/projects" class="text-base font-bold mr-4 hover:underline">{$t('header.discover')}</a>
        {#if $auth.isAuthenticated}
            {#if !isMobile}
                <IconMenu />
            {/if}
        {:else}
            <Locales />
            <button
                on:click={signUser} class="flex btn btn-ghost rounded-btn capitalize ml-2">
                {$t('header.login')}
            </button>
        {/if}
    </div>
</header>

<style>
 .bglass {
     backdrop-filter: blur(8px);
 }
</style>
