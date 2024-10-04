/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OmonNFT, ExtendedNft, BaseNFT } from '$lib/types/Nft';
import type { NomoManifest } from 'nomo-webon-kit';
import { Contract, ethers } from 'ethers';
import { avinoc_contract_eth } from '$lib/helper/constants';
import { getWebonsWithNFTInManifest } from './nft-webon-fetching';

export async function fetchPolygonNFTs(args: { address: string }): Promise<ExtendedNft[]> {
	const api = `https://api.polygonscan.com/api
   ?module=account
   &action=addresstokennftbalance
   &address=${args.address}`;

	const res = await fetch(api, { method: 'GET' });
	if (!res) throw Error;

	const data = await res.json();
	const baseNFTs = [] as BaseNFT[];
	const extendedNFTs: ExtendedNft[] = [];

	data?.result?.forEach((baseNFT: BaseNFT) => {
		if (baseNFT?.type === 'ERC-721') baseNFTs.push(baseNFT);
	});

	baseNFTs.forEach((baseNFT: BaseNFT) => {
		extendedNFTs.push({ baseNFT, manifest: null, omonNFT: null });
	});
	return extendedNFTs;
}

export async function fetchZENIQSmartchainNfts(args: {
	address: string;
	omonNFTs: any;
}): Promise<ExtendedNft[]> {
	const api = `https://zeniqscan.com/api?module=account&action=tokenlist&address=${args.address}`;

	const res = await fetch(api, { method: 'GET', mode: 'cors' });
	if (!res) throw Error;

	const data = await res.json();
	const baseNFTs = [] as BaseNFT[];
	const extendedNFTs: ExtendedNft[] = [];

	data?.result?.forEach((baseNFT: BaseNFT) => {
		if (baseNFT?.type === 'ERC-721') {
			baseNFTs.push(baseNFT);
		} else if (baseNFT?.type === 'ERC-1155') {
			if (baseNFT.decimals === '0' || !baseNFT.decimals) {
				baseNFTs.push(baseNFT);
			}
		}
	});

	const localManifests = await getWebonsWithNFTInManifest();

	baseNFTs.forEach((baseNFT: BaseNFT) => {
		const omonNFT: OmonNFT = args.omonNFTs.find(
			(c: any) => c.contractAddress.toLowerCase() === baseNFT.contractAddress?.toLowerCase()
		);
		let found_webon = false;
		localManifests.forEach((manifest) => {
			manifest.dependencies?.forEach(async (dep) => {
				if (baseNFT.contractAddress?.toLowerCase() === dep.toLowerCase()) {
					extendedNFTs.push({ baseNFT, manifest, omonNFT });
					found_webon = true;
				}
			});
		});
		if (!found_webon) extendedNFTs.push({ baseNFT, manifest: null, omonNFT });
	});
	return extendedNFTs;
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
	omonNFTs: any;
}): Promise<ExtendedNft[]> {
	const contract = getContract();
	const avinocEthBalance = await contract.balanceOf(args.address);
	if (Number(avinocEthBalance) === 0) return [];

	const omonNFT: OmonNFT = args.omonNFTs.find(
		(c: BaseNFT) => c.contractAddress.toLowerCase() === avinoc_contract_eth
	);
	const baseNFT: BaseNFT = {
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
	return [{ baseNFT, manifest: avinocDeFiManifest, omonNFT }];
}
