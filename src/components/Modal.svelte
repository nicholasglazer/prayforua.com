<script>
 import XIcon from '$components/icons/X.svelte';
 export let showModal; // boolean

 export let dialog; // HTMLDialogElement

 $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	id="new_project_modal"
	class="modal"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="modal-box">
		<div class="flex justify-between">
			<slot name="header" />
			<button class="btn btn-sm btn-square btn-ghost" on:click={() => dialog.close()}><XIcon /></button>
		</div>
		<slot />
	</div>
</dialog>
