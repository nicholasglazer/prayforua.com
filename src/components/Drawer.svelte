<script>
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import IconMenu from '$components/IconMenu.svelte';
 import Locales from '$components/Locales.svelte';
</script>
<div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
        <label for="my-drawer" class="drawer-button">
            <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
        </label>
    </div>
    <div class="drawer-side ease-out duration-100">
        <label for="my-drawer" class="drawer-overlay" />
        <div class="menu p-4 w-72 h-full bg-base-100 text-base-content">
            <div class="flex items-center justify-between">
                <label for="my-drawer" class="w-fit cursor-pointer">
                    <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                </label>
                <small>
                    {$auth.google.profile?.email ?? ''}
                </small>
                <IconMenu />
            </div>
            <div class="mt-8">
                <a href="projects" class="text-lg font-bold">
                    {$t('route.projects')}
                </a>
                <Locales />
            </div>
        </div>
    </div>
</div>

<style>
 .drawer-side > :not(.drawer-overlay) {
     @apply ease-out duration-200;
 }
</style>
