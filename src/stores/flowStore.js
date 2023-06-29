import {writable} from 'svelte/store';

export const transactionStatus = writable(null);
export const transactionInProgress = writable(false);
export const txId = writable(null);
