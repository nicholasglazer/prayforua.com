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
    {#if $auth.google.profile?.picture}
        <div class="dropdown dropdown-end">
            <label tabindex="0" class="cursor-pointer">
                <div class="avatar">
                    <div class="md:w-10 max-md:w-8 mask mask-squircle">
                        <img alt="avatar" src={$auth.google.profile?.picture} />
                    </div>
                </div>
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
    {:else}
        <div class="avatar">
            <div class="w-10 mask mask-squircle">
                <strong>{$auth.google.profile?.name ?? "User"}</strong>
            </div>
        </div>
    {/if}
</div>
