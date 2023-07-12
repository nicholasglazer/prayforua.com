<script>
 import {t} from '$stores/l10nStore';
 export let data
 console.log('data', data)
</script>
<div>
    <h3>{data?.name} {$t('project.by')}</h3>
    page exists
</div>
