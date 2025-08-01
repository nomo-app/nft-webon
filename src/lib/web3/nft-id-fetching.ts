import type { NomoEvmNetwork } from 'nomo-webon-kit';
import { getEthersProvider, getEvmAddress } from './ethers-providers';
import { nomoFetchERC721 } from 'ethersjs-nomo-webons';

export async function fetchNFTIDs(args: { chain: NomoEvmNetwork; nftContractAddress: string }) {
	const provider = getEthersProvider(args.chain);
  const evmAddress = await getEvmAddress();
	const tokenIds = await nomoFetchERC721({
		provider,
		nftContractAddress: args.nftContractAddress,
		evmAddress,
	});
  return tokenIds;
}
