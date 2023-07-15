<script>
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import {goto} from '$app/navigation';

 function signOutUser() {
     auth.googleSignOut()
     auth.unauthenticateFlowAccount();
     goto('/');
 }
</script>
<div>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="cursor-pointer">
            {#if $auth.google.profile?.picture}
                <div class="avatar">
                    <div class="w-10 mask mask-circle">
                        <img alt="avatar" src={$auth.google.profile?.picture} />
                    </div>
                </div>
            {:else}
                <div class="avatar">
                    <div class="w-10 mask mask-circle">
                        <div class="bg-base5 h-full w-full"></div>
                    </div>
                </div>
            {/if}
        </label>
        <ul tabindex="0" class="bglass bg-base7 menu dropdown-content z-[1] p-2 shadow rounded-box w-104 mt-4">
            <li>
                <a href="/user">
                    {$t('route.account')}
                </a>
            </li>
            <li>
                <a href="/user/settings">
                    {$t('route.settings')}
                </a>
            </li>
            <li class="text-red">
                <button on:click={signOutUser}>{$t('header.logout')}</button>
            </li>
        </ul>
    </div>
</div>
