<script>
 import {auth} from '$stores/authStore';
 import {t} from '$stores/l10nStore';

 import {transactionStatus} from "$stores/flowStore";
 import {flowUnauth, flowLogIn, initAccount, sendQuery, executeTransaction} from '$lib/flow/actions';
</script>

<div class="flex flex-col" >
    <h1>
        {$t('user.settings.connectWallet')}
    </h1>
    <button class="btn" on:click={() => flowLogIn()}>
        login with flow
    </button>
    <button class="btn" on:click={() => flowUnauth()}>
        logout with flow
    </button>
    <div>
        {$auth.flow.user?.addr}
    </div>
    <div>
        {$transactionStatus}
    </div>
</div>
<div class="divider"></div>
<div class="flex">
    {$t('user.settings.language')}
</div>
<div class="divider"></div>
