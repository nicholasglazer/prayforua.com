<script>
 import NewProjectModal from '$components/NewProjectModal.svelte';
 import CardsFallback from '$components/CardsFallback.svelte';
 import ProjectCard from '$components/ProjectCard.svelte';
 import {project} from '$stores/projectStore';
</script>

<div class="mt-8 mb-4">
    <NewProjectModal />
</div>

{#if $project.currentProjectsStatus === false}
    <CardsFallback />
{/if}
{#if $project.currentProjectsStatus === true}
    <div class="grid max-md:grid-cols-1 grid-cols-2 gap-3 mb-10">
        {#each Object.entries($project.projects) as p (p[0])}
            <ProjectCard p={p} />
        {/each}
    </div>
{/if}
{#if $project.currentProjectsStatus === null}
    <div class="w-full flex justify-center">
        Create your first project!
    </div>
{/if}
