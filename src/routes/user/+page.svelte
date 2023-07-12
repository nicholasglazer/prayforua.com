<script>
 import ProfileBlock from '$components/ProfileBlock.svelte';
 import ProjectsTab from '$components/ProjectsTab.svelte';
 import EventsTab from '$components/EventsTab.svelte';
 import Tabs from '$components/Tabs.svelte';

 let items = [
     {
         label: "Projects",
         value: 1,
         component: ProjectsTab
     },
     {
         label: "Interactions",
         value: 2,
         component: EventsTab
     }
 ];
</script>

<div class="bg-base8 flex w-full justify-center">
    <div class="flex flex-1 flex-col items-center w-2xl max-w-2xl">
        <ProfileBlock />
        <Tabs {items} />
    </div>
    <div class="divider"></div>
</div>
