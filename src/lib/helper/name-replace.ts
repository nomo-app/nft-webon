import type { ExtendedNft } from '$lib/types/Nft';

export function getNftName(nft: ExtendedNft): string {
	const rawName = nft.baseNFT?.name;
	if (!rawName) {
		return '';
	}
	if (rawName.includes('NameWrapper')) {
		return 'ZNQ Domain Name';
	}
	return rawName;
}
