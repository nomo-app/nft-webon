import type { NomoEvmNetwork } from 'nomo-webon-kit';
import { getEthersProvider, getEvmAddress } from './ethers-providers';
import { nomoFetchERC721 } from 'ethersjs-nomo-webons';
import { getNftBalanceFetchContract } from './nft-balance-fetching';

export async function fetchNFTIDs(args: {
	chain: NomoEvmNetwork;
	nftContractAddress: string;
}): Promise<bigint[]> {
	if (args.chain === 'polygon') {
		return fetchNFTIDsERC721Enumerable(args);
	}
	const provider = getEthersProvider(args.chain);
	const evmAddress = await getEvmAddress();
	const nftList = await nomoFetchERC721({
		provider,
		nftContractAddress: args.nftContractAddress,
		evmAddress
	});
	return nftList.map((nft) => nft.tokenID);
}

/**
 * This works for contracts that inherit from erc721-enumerable.
 */
export async function fetchNFTIDsERC721Enumerable(args: {
	chain: NomoEvmNetwork;
	nftContractAddress: string;
}): Promise<bigint[]> {
	const evmAddress = await getEvmAddress();
	const provider = getEthersProvider(args.chain);
	const nftContract = getNftBalanceFetchContract(provider, args.nftContractAddress);
	let index: bigint = 0n;
	const balance = await nftContract.balanceOf(evmAddress);
	const ownedTokenIDs: bigint[] = [];
	while (index < balance) {
		const tokenID = await nftContract.tokenOfOwnerByIndex(evmAddress, index);
		ownedTokenIDs.push(tokenID);
		index++;
	}
	return ownedTokenIDs;
}
