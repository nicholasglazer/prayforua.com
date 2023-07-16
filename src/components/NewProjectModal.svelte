<script>
 import {project, newProject, resetNewProjectStore} from '$stores/projectStore';
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import XIcon from '$components/icons/X.svelte';
 import Modal from '$components/Modal.svelte';

 let d;
 $: showModal = false;
 function addProject() {
     // TODO maybe? replace logic with server-side checks
     if ($newProject.title !== '' && $newProject.imageCover !== '') {
         d.close();
         project.addProject($newProject);
         resetNewProjectStore();
     }
     return;
 }
 function updateNewProject(payload) {
     newProject.update((prev) => ({...prev, ...payload}))
 }
</script>

<button class="btn btn-ghost" on:click={() => (showModal = true)}>
    {$t('user.createProject')}
    <div class="rotate-45 ml-2">
        <XIcon/>
    </div>
</button>

<Modal bind:showModal bind:dialog={d}>
    <h3 slot="header" class="font-bold text-lg">You're about to create new volounteer project!</h3>
    <form>
        <div class="flex flex-col">
            <label for="create-project-title" required class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.title')}</label>
            <input id="create-project-title" bind:value="{$newProject.title}" on:input="{(e) => updateNewProject({title: e.target.value}, e)}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
        </div>

        <div class="flex flex-col">
            <label for="create-project-cover" required class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.imageCover')}</label>
            <input id="create-project-cover" bind:value="{$newProject.imageCover}" on:input="{(e) => updateNewProject({imageCover: e.target.value})}" type="text" placeholder="https://..." class="input input-bordered input-sm font-bold w-full" />
        </div>

        <div class="flex flex-col">
            <label for="create-project-description" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.description')}</label>
            <textarea id="create-project-description" bind:value="{$newProject.description}" on:input="{(e) => updateNewProject({description: e.target.value})}" placeholder="" class="textarea textarea-bordered font-bold textarea-md w-full" />
        </div>
        <div class="divider"></div>
        <h4 class="font-bold text-base">Donation settings</h4>

        {#if $auth.flow.user?.addr}
            <div class="flex flex-col">
                <label for="flow-create-project-address-settings" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.settings.yourAddress')}</label>
                <kbd id="flow-create-project-address-settings" class="kbd w-full mb-4">
                    {$auth.flow.user?.addr}
                </kbd>
            </div>
            <div class="flex flex-col">
                <label for="create-project-goal" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.goal')}</label>
                <kbd id="flow-create-project-address-settings" class="kbd w-full mb-4">
                    {$newProject.goal} Flow
                </kbd>
                <input id="create-project-goal" type="range" min="0" max="100000" bind:value="{$newProject.goal}" on:input="{(e) => updateNewProject({goal: e.target.value})}" class="range range-primary" />
                <input id="create-project-goal" min="0" max="100000" bind:value="{$newProject.goal}" on:input="{(e) => updateNewProject({goal: e.target.value})}" class="range range-primary" />
            </div>

            <div class="flex justify-end">
                <button class="btn btn-md btn-ghost mr-2 mt-4" on:click={addProject}>{$t('user.add')}</button>
            </div>
        {:else}
            <div class='text-center'>
                {@html $t('user.edit.flowNotConnected')}
            </div>
        {/if}
    </form>
    <!-- <form method="dialog" class="modal-backdrop">
         <button />
         </form> -->
</Modal>
