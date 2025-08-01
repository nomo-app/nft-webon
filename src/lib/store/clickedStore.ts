import { type Writable, writable } from 'svelte/store';
import type { ExtendedNft } from '$lib/types/Nft';
import type { NomoEvmNetwork } from 'nomo-webon-kit';

export const clickedStore: Writable<ExtendedNft> = writable();

export const selectedChain = writable<NomoEvmNetwork>('zeniq-smart-chain');

export const selectedNFTIdStore: Writable<bigint> = writable();
