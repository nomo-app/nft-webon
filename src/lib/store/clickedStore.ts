import { type Writable, writable } from 'svelte/store';
import type { ExtendedNft } from '$lib/types/Nft';

export const clickedStore: Writable<ExtendedNft> = writable();

export const selectedChain = writable('ZSC');

export const selectedNFTIdStore: Writable<number> = writable();
