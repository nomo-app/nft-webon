import type { NomoEvmNetwork } from 'nomo-webon-kit';
import { getEthersProvider, getEvmAddress } from './ethers-providers';
import { nomoFetchERC721 } from 'ethersjs-nomo-webons';

export async function fetchNFTIDs(args: {
	chain: NomoEvmNetwork;
	nftContractAddress: string;
}): Promise<bigint[]> {
	const provider = getEthersProvider(args.chain);
	const evmAddress = await getEvmAddress();
	const nftList = await nomoFetchERC721({
		provider,
		nftContractAddress: args.nftContractAddress,
		evmAddress
	});
	return nftList.map((nft) => nft.tokenID);
}
