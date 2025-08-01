import type { NomoEvmNetwork } from 'nomo-webon-kit';
import { getEthersProvider, getEvmAddress } from './ethers-providers';
import { nomoFetchERC721 } from 'ethersjs-nomo-webons';
import { getNftBalanceFetchContract } from './nft-balance-fetching';

export async function fetchNFTIDs(args: {
	chain: NomoEvmNetwork;
	nftContractAddress: string;
}): Promise<bigint[]> {
	// if (args.chain === 'polygon') {
	// 	return fetchOwnedNFTIDsByEnumeration(args);
	// }
	const provider = getEthersProvider(args.chain);
	const evmAddress = await getEvmAddress();
	const nftList = await nomoFetchERC721({
		provider,
		nftContractAddress: args.nftContractAddress,
		evmAddress
	});
	return nftList.map((nft) => nft.tokenID);
}

export async function fetchOwnedNFTIDsByEnumeration(args: {
	chain: NomoEvmNetwork;
	nftContractAddress: string;
}): Promise<bigint[]> {
	const evmAddress = await getEvmAddress();
	const provider = getEthersProvider(args.chain);
	const nftContract = getNftBalanceFetchContract(provider, args.nftContractAddress);
	let tokenID: bigint = 1n;
	const maxTokenID = 1500n;
	const ownedTokenIDs: bigint[] = [];
	while (tokenID < maxTokenID) {
		try {
			const owner = await nftContract.ownerOf(tokenID);
			if (owner.toLowerCase() === evmAddress.toLowerCase()) {
				ownedTokenIDs.push(tokenID);
			}
		} catch (error) {
			console.error(`Error fetching owner for token ID ${tokenID}:`, error);
		}
		tokenID++;
	}
	return ownedTokenIDs;
}
