<script>
 import {project, currencyGoal} from '$stores/projectStore';
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 import XIcon from '$components/icons/X.svelte';
 // TODO replace logic with server-side checks
 function addProject() {
     console.log('$uu', $project.newProject)
     if ($project.newProject.name !== '' && $project.newProject.coverImage !== '' && $project.newProject.description !== '') {
         project.addProject($project.newProject)
     }
     return;
 }
</script>

<!-- Open the modal using ID.showModal() method -->
<button class="btn btn-ghost" onclick="new_project_modal.showModal()">
    {$t('user.createProject')}
    <div class="rotate-45 ml-2">
        <XIcon/>
    </div>
</button>
<dialog id="new_project_modal" class="modal">
    <form method="dialog" class="modal-box">
        <div class="flex justify-end">
            <button class="btn btn-sm btn-square btn-ghost" onclick="new_project_modal.showModal()"><XIcon /></button>
        </div>

        <h3 class="font-bold text-lg">You're about to create new volounteer project!</h3>

        <div class="flex flex-col">
            <label for="create-project-title" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.title')}</label>
            <input id="create-project-title" required bind:value="{$project.newProject.name}" on:input="{(e) => project.update((prev) => ({...prev, newProject: {...prev.newProject, name: e.target.value}}))}" type="text" placeholder="" class="input input-bordered input-sm font-bold w-full" />
        </div>

        <div class="flex flex-col">
            <label for="create-project-cover" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.coverImage')}</label>
            <input id="create-project-cover" required bind:value="{$project.newProject.coverImage}" on:input="{(e) => project.update((prev) => ({...prev, newProject: {...prev.newProject, coverImage: e.target.value}}))}" type="text" placeholder="https://..." class="input input-bordered input-sm font-bold w-full" />
        </div>

        <div class="flex flex-col">
            <label for="create-project-description" class="text-xs font-bold mt-2.5 mb-1.5">{$t('user.createProject.description')}</label>
            <textarea id="create-project-description" required bind:value="{$project.newProject.description}" on:input="{(e) => project.update((prev) => ({...prev, newProject: {...prev.newProject, description: e.target.value}}))}" placeholder="" class="textarea textarea-bordered font-bold textarea-md w-full" />
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
                    {$currencyGoal}
                </kbd>
                <input id="create-project-goal" required type="range" min="0" max="100000" bind:value="{$project.newProject.goal}" on:input="{(e) => project.update((prev) => ({...prev, newProject: {...prev.newProject, goal: e.target.value}}))}" class="range range-primary" />
                <input id="create-project-goal" required min="0" max="100000" bind:value="{$project.newProject.goal}" on:input="{(e) => project.update((prev) => ({...prev, newProject: {...prev.newProject, goal: e.target.value}}))}" class="range range-primary" />
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
    <form method="dialog" class="modal-backdrop">
        <button />
    </form>
</dialog>
