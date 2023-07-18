<script>
 import {clamp} from 'ramda';
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import Modal from '$components/Modal.svelte';
 import {transferFlow} from '$lib/flow/actions';
 import {writable} from 'svelte/store';

 const amount = writable(0);

 export let projectData;

 $: intNum = parseFloat($auth?.flow?.balance.replace('.', ','))

 let d;
 let showModal = false;

 function handleInput(value) {
     amount.set(clamp(0, Number($auth?.flow?.balance), value));
 }
 function makeDonation(amt, addr) {
     showModal = true;
     transferFlow(amt, addr);
 }
 console.log('to', $auth.flow.balance.replace('.', ','))
 console.log('int', intNum)
</script>
<!-- <button class="btn bg-green text-base1 w-full mt-4" on:click="{() => getAccountBalance($auth?.flow?.user.addr)}">balance</button> -->

<button class="btn bg-green text-base1 w-full" on:click="{() => (showModal = true)}">
    {$t('project.donate')}
</button>

<Modal bind:showModal bind:dialog={d}>
    <h3 slot="header" class="font-bold text-lg">You're about to donate!</h3>
    <form>
        <h4 class="font-bold text-base">Donation settings</h4>
        {#if $auth?.flow?.user?.addr}
            <div class="flex flex-col">
                <label for="flow-create-project-address-settings" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.settings.yourAddress')}</label>
                <kbd id="flow-create-project-address-settings" class="kbd w-full mb-4">
                    {$auth?.flow?.user?.addr}
                </kbd>
            </div>
            <div class="flex flex-col">
                <label for="flow-create-project-address-settings" class="text-xs font-bold mt-2.5 mb-1.5">{$t('project.to')}</label>
                <kbd id="flow-create-project-address-settings" class="kbd w-full mb-4">
                    {projectData.creator?.flow?.user.addr}
                </kbd>
            </div>
            <div class="flex flex-col">
                <input id="create-project-goal" type="range" min="0" max="{intNum}" bind:value="{$amount}" on:input="{(e) => amount.set(e.target.value)}" class="range range-primary" />
                <input id="create-project-goal" min="0" max="{auth?.flow?.balance}" bind:value="{$amount}" on:input="{(e) => handleInput(e.target.value)}" class="range range-primary" />
            </div>

            <div class="flex justify-end">
                <button class="btn btn-md btn-ghost mr-2 mt-4" on:click={() => makeDonation(`${$amount}.0`, projectData.creator?.flow?.user?.addr)}>{$t('project.donate')}</button>
            </div>
        {:else}
            <div class='text-center'>
                {@html $t('user.edit.flow?NotConnected')}
            </div>
        {/if}
    </form>
</Modal>
