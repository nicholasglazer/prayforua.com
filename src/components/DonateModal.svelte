<script>
 // import {project, newProject, resetNewProjectStore} from '$stores/projectStore';
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import Modal from '$components/Modal.svelte';
 import {getAccountBalance, transferFlow} from '$lib/flow/actions';

 export let projectData;

 $: donationObj = {
     amount: ''
 }

 let d;
 $: showModal = false;
 // function updateNewProject(payload) {
 //     newProject.update((prev) => ({...prev, ...payload}))
 // }

 function makeDonation(amt, addr) {
     transferFlow(amt, addr);
     showModal = false;
 }
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
                <input id="create-project-goal" type="range" min="1" max="{auth?.flow?.balance}" bind:value="{donationObj.amount}" on:input="{(e) => (donationObj.amount = e.target.value)}" class="range range-primary" />
                <input id="create-project-goal" min="0" max="{auth?.flow?.balance}" bind:value="{donationObj.amount}" on:input="{(e) => (donationObj.amount = e.target.value)}" class="range range-primary" />
            </div>

            <div class="flex justify-end">
                <button class="btn btn-md btn-ghost mr-2 mt-4" on:click={() => makeDonation(`${donationObj.amount}.0`, projectData.creator?.flow?.addr)}>{$t('user.add')}</button>
            </div>
        {:else}
            <div class='text-center'>
                {@html $t('user.edit.flow?NotConnected')}
            </div>
        {/if}
    </form>
</Modal>
