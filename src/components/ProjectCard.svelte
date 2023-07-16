<script>
 import {t} from '$stores/l10nStore';
 export let p;
</script>

<a href="projects/{p[1].id}" class="card bg-base6 shadow-sm hover:shadow-xl hover:transition-all transition ease-in-out delay-3050 image-full overflow-hidden whitespace-nowrap text-ellipsis">
    <figure>
        <img src="{p[1].coverImage}" alt="image link is broken" />
    </figure>
    <div class="card-body">
        <h2 class="card-title overflow-hidden whitespace-nowrap text-ellipsis">{p[1].title}</h2>
        <p class="overflow-hidden whitespace-normal text-ellipsis max-h-[116px]">{p[1].description}</p>
        <div class="card-actions justify-end">
            <a href="projects/{p[1].id}/edit" class="btn btn-ghost btn-xs btn-outline">{$t('user.project.edit')}</a>
        </div>
    </div>
</a>
