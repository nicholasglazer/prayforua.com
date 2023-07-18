<script>
 import {auth} from '$stores/authStore';
 import {readableDate} from '$lib/utils/readableDate';
</script>

<div class="mt-8">
    {#if $auth.flow.transactions.length}
        {#each $auth.flow.transactions.reverse() as tx}
            <div class="chat chat-start">
                <div class="chat-header ml-3">
                    {tx.event}
                    <time class="text-xs opacity-50">{readableDate(tx.timestamp)}</time>
                </div>
                <a href="https://testnet.flowscan.org/transaction/{tx.txId}" target="_blank" class="chat-bubble chat-bubble-accent hover:text-base8">{tx.txId}</a>
                <div class="chat-footer opacity-50">
                    {tx.status === 4 ? 'Sealed' : ''}
                </div>
            </div>
            <div class="chat chat-start">
            </div>
        {/each}
    {:else}
        <h3 class="font-bold">
            No interactions yet!
        </h3>
    {/if}
</div>
