<script>
 import '../styles/app.css';
 import {onMount} from 'svelte';
 import {locale} from '$stores/l10nStore';
 import {auth} from '$stores/authStore';

 onMount(() => {
     locale.useLocalStorage();
     auth.useLocalStorage();
 });
</script>

<slot />
