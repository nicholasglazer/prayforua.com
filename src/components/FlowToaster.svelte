<script>
 import {
     txId,
     transactionStatus,
     transactionInProgress,
 } from "$stores/flowStore";
 import {slide} from "svelte/transition";
</script>

{#if $transactionInProgress}
    <div transition:slide class="max-w-sm rounded fixed bottom-2 right-2 p-6 pb-4 {$transactionStatus === 99 ? 'bg-red' : 'bg-green'}">
        {#if $transactionStatus < 0}
            <span>
                <p class="text-xl font-mono font-bold">Initializing...</p><br/>
                <small class="text-sm font-bold">Waiting for transaction approval.</small>
            </span>
            <progress class="progress progress-primary" indeterminate />
        {:else if $transactionStatus < 2}
            <span>
                <p class="text-xl font-mono font-bold">Pending</p>
                <span class="txId">
                    <a href={`https://testnet.flowscan.org/transaction/${$txId}`} rel="noreferrer" target="_blank">
                        {$txId?.slice(0, 8)}...
                    </a>
                </span><br/>
                <small class="text-sm font-bold">
                    The transaction has been received by a collector but not yet finalized
                    in a block.
                </small>
            </span>
            <progress class="progress progress-primary" indeterminate>Finalizing...</progress>
        {:else if $transactionStatus === 2}
            <span>
                <p class="text-xl font-mono font-bold">Finalized</p>
                <span class="txId">
                    <a href={`https://testnet.flowscan.org/transaction/${$txId}`} rel="noreferrer" target="_blank">
                        {$txId?.slice(0, 8)}...
                    </a>
                </span><br/>
                <small class="text-sm font-bold">The consensus nodes have finalized the block that the transaction is included in.</small>
            </span>
            <progress class="progress progress-primary"min="0" max="100" value="60">Executing...</progress>
        {:else if $transactionStatus === 3}
            <span>
                <p class="text-xl font-mono font-bold">Executed</p>
                <span class="txId">
                    <a href={`https://testnet.flowscan.org/transaction/${$txId}`} rel="noreferrer" target="_blank">
                        {$txId?.slice(0, 8)}...
                    </a>
                </span><br/>
                <small class="text-sm font-bold">
                    The execution nodes have produced a result for the transaction.
                </small>
            </span>
            <progress class="progress progress-primary"min="0" max="100" value="80">Sealing...</progress>
        {:else if $transactionStatus === 4}
            <span>
                <p class="text-xl font-mono font-bold">✓ Sealed</p>
                <span class="txId">
                    <a href={`https://testnet.flowscan.org/transaction/${$txId}`} rel="noreferrer" target="_blank">
                        {$txId?.slice(0, 8)}...
                    </a>
                </span><br/>
                <small class="text-sm font-bold">The verification nodes have verified the transaction, and the seal is included in the latest block.</small>
            </span>
            <progress class="progress progress-primary"min="0" max="100" value="100">Sealed!</progress>
        {:else if $transactionStatus === 5}
            <span>
                <p class="text-xl font-mono font-bold">Expired</p>
                <span class="txId">
                    <a href={`https://testnet.flowscan.org/transaction/${$txId}`} rel="noreferrer" target="_blank">
                        {$txId?.slice(0, 8)}...
                    </a>
                </span><br/>
                <small class="text-sm font-bold">The transaction was submitted past its expiration block height.</small>
            </span>
        {:else}
            <span>
                <p class="text-xl font-bold font-font-mono pb-4">Failed...</p>
                <p class="text-base7 text-base font-bold">Unfortunately transaction was declined!</p>
            </span>
        {/if}
    </div>
{/if}
