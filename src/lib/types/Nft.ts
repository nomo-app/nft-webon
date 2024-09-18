import type { NomoManifest } from 'nomo-webon-kit';

/**
 * BaseNFT can be any NFT from any network.
 */
export type BaseNFT = {
	balance: string;
	contractAddress: string;
	decimals: string;
	name: string;
	symbol: string;
	type: string;
};

/**
 * ExtendedNft provides a merge between NFTs and WebOns.
 */
export type ExtendedNft = {
	baseNFT: BaseNFT;
	manifest: NomoManifest | null;
	omonNFT: OmonNFT | null;
};

/**
 * OmonNFT is a known entry from the Nomo-specific database of NFTs.
 */
export type OmonNFT = {
	name: string;
	symbol: string;
	decimals: null;
	contractAddress: string;
	network: string;
	type: string;
	is_nft: boolean;
	has_image_uris: boolean;
	not_transferable: boolean;
	webons: string[];
};
