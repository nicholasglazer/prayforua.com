<script>
 import '../styles/app.css';
 import Header from '$components/Header.svelte';
 import Tx from '$components/FlowToaster.svelte';
</script>

<Header />
<Tx />

<slot />
