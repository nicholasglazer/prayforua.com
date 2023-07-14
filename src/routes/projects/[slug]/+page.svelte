<script>
 import {t} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';
 export let data;
 console.log('data', data)
</script>

<div class="flex flex-col w-full items-center mt-12">
    <div class="flex flex-1 flex-col items-center w-2xl max-w-2xl">
        <h3 class="text-2xl font-bold">{data.name} {$t('project.by')} {data.creator.firstName} {data.creator.lastName}</h3>
        <p>{data.description}</p>
    </div>
    <div class="">
        <img src="{data.coverImage}" alt="" />

    </div>

    <div class="divider"></div>

</div>
{#if data.creator.id === $auth.user.id}
    <a href="{data.id}/edit" class="">
        settings
    </a>
{/if}
