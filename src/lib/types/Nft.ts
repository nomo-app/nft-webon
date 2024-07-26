import type { NomoManifest } from 'nomo-webon-kit';

export type Nft = {
	id: string;
	contract_address: string;
	explorer_link: string;
	webon_domain: string;
};
export type NomoToken = {
	balance: string;
	contractAddress: string;
	decimals: string;
	name: string;
	symbol: string;
	type: string;
};
export type ExtendedNft = {
	nft: NomoToken;
	manifest: NomoManifest | null;
	contract: DbNftResponse;
	contractAddress?: string;
};

export type DbNftResponse = {
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
