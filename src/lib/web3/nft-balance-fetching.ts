/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DbNftResponse, ExtendedNft, NomoToken } from '$lib/types/Nft';
import type { NomoManifest } from 'nomo-webon-kit';
import { Contract, ethers } from 'ethers';
import { avinoc_contract_eth } from '$lib/helper/constants';
import { getWebonsWithNFTInManifest } from './nft-webon-fetching';

export async function fetchZENIQSmartchainNfts(args: {
	address: string;
	knownNFTs: any;
}): Promise<ExtendedNft[]> {
	const api = `https://zeniqscan.com/api?module=account&action=tokenlist&address=${args.address}`;

	const res = await fetch(api, { method: 'GET', mode: 'cors' });
	if (!res) throw Error;

	const data = await res.json();
	const raw_nfts = [] as NomoToken[];
	const Nfts: ExtendedNft[] = [];

	data?.result?.forEach((token: NomoToken) => {
		if (token?.type === 'ERC-721') raw_nfts.push(token);
	});

	const localManifests = await getWebonsWithNFTInManifest();

	raw_nfts.forEach((r_nft: NomoToken) => {
		const contract: DbNftResponse = args.knownNFTs.find(
			(c: any) => c.contractAddress.toLowerCase() === r_nft.contractAddress?.toLowerCase()
		);
		let found_webon = false;
		localManifests.forEach((manifest) => {
			manifest.dependencies?.forEach(async (dep) => {
				if (r_nft.contractAddress?.toLowerCase() === dep.toLowerCase()) {
					Nfts.push({ nft: r_nft, manifest: manifest, contract: contract });
					found_webon = true;
				}
			});
		});
		if (!found_webon) Nfts.push({ nft: r_nft, manifest: null, contract: contract });
	});
	return Nfts;
}

function getContract(): Contract {
	const provider = ethers.getDefaultProvider();
	return new ethers.Contract(
		avinoc_contract_eth,
		[`function balanceOf(address owner) view returns (uint256)`],
		provider
	);
}

export async function getEthereumAvinocNfts(args: {
	address: string;
	knownNFTs: any;
}): Promise<ExtendedNft[]> {
	const contract = getContract();
	const avinocEthBalance = await contract.balanceOf(args.address);
	if (Number(avinocEthBalance) === 0) return [];
	const contractInCoinList: DbNftResponse = args.knownNFTs.find(
		(c: NomoToken) => c.contractAddress.toLowerCase() === avinoc_contract_eth
	);
	const nft: NomoToken = {
		balance: Number(avinocEthBalance).toString(),
		contractAddress: avinoc_contract_eth,
		decimals: '',
		name: 'Staking NFT',
		symbol: '',
		type: 'ERC-721'
	};
	const avinocDeFiManifest: NomoManifest = {
		nomo_manifest_version: '1.2.0',
		webon_id: 'com.avinoc.defi',
		webon_name: 'AVINOC DeFi',
		webon_version: '0.1.26',
		dependencies: ['0x97F51eCDeEdecdb740DD1ff6236D013aFff0417d'],
		permissions: [
			'nomo.permission.ADD_CUSTOM_TOKEN',
			'nomo.permission.SIGN_EVM_TRANSACTION',
			'nomo.permission.SIGN_EVM_MESSAGE',
			'nomo.permission.GET_INSTALLED_WEBONS',
			'nomo.permission.INSTALL_WEBON'
		],
		webon_url: 'https://defi.avinoc.com',
		min_nomo_version: '0.5.0'
	};
	return [{ nft: nft, manifest: avinocDeFiManifest, contract: contractInCoinList }];
}
