<script>
 import '../styles/app.css';
 import Header from '$components/Header.svelte';
 import {onMount} from 'svelte';
 import {locale} from '$stores/l10nStore';
 import {project} from '$stores/projectStore';
 import {auth} from '$stores/authStore';
 import Tx from '$components/FlowToaster.svelte';

 onMount(() => {
     locale.useLocalStorage();
     project.useLocalStorage();
     auth.useLocalStorage();
 });
</script>

<Header />
<Tx />

<slot />
