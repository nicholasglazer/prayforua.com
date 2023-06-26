<script>
 import {t, locale, locales} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 // import {signIn, signOut} from '@auth/sveltekit/client';

 function signUser() {
     auth.googleSignIn();
     // signIn("google")
 }
 function signOutUser() {
     auth.googleSignOut()
     // signOut()
 }
</script>


<header class="glass bglass sticky z-[200] shadow top-0 navbar">
    <div class="flex-1 px-2 lg:flex-none">
        <a href="/" class="text-lg font-bold">{$t('header.logo')}</a>
    </div>
    <div class="flex justify-end flex-1 px-2">
        <div class="flex items-stretch">
            {#if $auth.isAuthenticated}
                {#if $auth.user?.picture}
                    <div class="dropdown dropdown-end mr-2">
                        <label tabindex="0" class="cursor-pointer">
                            <div class="avatar">
                                <div class="w-10 mask mask-squircle">
                                    <img alt="avatar" src={$auth.user.picture} />
                                </div>
                            </div>
                        </label>
                        <ul tabindex="0" class="bglass menu dropdown-content z-[1] p-2 shadow rounded-box w-104 mt-4">
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
                            <strong>{$auth.user?.name ?? "User"}</strong>
                        </div>
                    </div>
                {/if}
            {:else}
                <select bind:value={$locale} class="text-lg select select-ghost w-full">
                    {#each locales as l}
                        <option value={l[0]}>{l[2]}</option>
                    {/each}
                </select>
                <button
                    on:click={signUser} class="flex btn btn-ghost rounded-btn capitalize ml-2">
                    {$t('header.login')}
                </button>
            {/if}
        </div>
    </div>
</header>

<style>
 .bglass {
     backdrop-filter: blur(8px);
 }
</style>
