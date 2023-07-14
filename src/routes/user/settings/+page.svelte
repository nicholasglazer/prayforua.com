<script>
 import {auth} from '$stores/authStore';
 import {t} from '$stores/l10nStore';
 import Locales from '$components/Locales.svelte';
 import {flowUnauth, flowLogIn} from '$lib/flow/actions';

 function logOutFlow() {
     flowUnauth();
     auth.unauthenticateFlowAccount();
 }
 function deleteUser() {
     logOutFlow();
     auth.deleteUser();
 }
</script>

<div class="w-full max-w-2xl mt-8 mb-2 flex justify-between items-center">
    <small class="mr-4 font-semibold">
        {$t('user.settings.pageDescription')}
    </small>
    <a class="btn btn-ghost btn-outline btn-sm" href="/user">
        {$t('user.edit.backBtn')}
    </a>
</div>
<div class="w-full max-w-2xl bg-base8 shadow m-8 p-4">
    <div class="flex max-md:flex-col md:items-center justify-between">
        {#if $auth.flow.user?.addr}
            <div class="flex flex-col align-center">
                <label for="flow-address-settings" class="font-bold mb-1">
                    {$t('user.settings.yourAddress')}
                </label>
                <kbd id="flow-address-settings" class="kbd max-md:mb-2.5">
                    {$auth.flow.user?.addr}
                </kbd>
            </div>
            <button class="btn bg-base4 hover:bg-red text-base7" on:click={logOutFlow}>
                {$t('user.settings.disconnectWallet')}
            </button>
        {:else}
            <span class="font-bold font-sm">
                {$t('user.settings.connectDescription')}
            </span>
            <button class="btn bg-green" on:click={() => flowLogIn()}>
                {$t('user.settings.connectWallet')}
            </button>
        {/if}
    </div>
    <div class="divider"></div>
    <div class="flex items-center justify-between">
        <span class="font-bold font-sm">
            {$t('user.settings.language')}
        </span>
        <Locales />
    </div>
    <div class="divider"></div>

    <div class="flex max-md:flex-col md:items-center justify-between">
        <span class="font-bold font-sm">
            {$t('user.settings.deleteBtnDescription')}
        </span>
        <button class="btn bg-red" on:click={() => deleteUser()}>
            {$t('user.settings.deleteBtn')}
        </button>
    </div>
</div>

<!-- <div class="w-full max-w-xl bg-base8 shadow mt-8 m-8 p-4 py-8">
     </div> -->
