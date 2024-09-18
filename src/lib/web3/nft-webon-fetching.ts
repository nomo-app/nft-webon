/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFallbackModeActive, nomoGetInstalledWebOns, type NomoManifest } from 'nomo-webon-kit';

/**
 * Returns known NFTs from a webon.info-API (from the Omon-database)
 */
export async function fetchOmonNFTs() {
	const res = await fetch('https://webon.info/api/tokens');
	const json = await res.json();
	return json.filter((j: any) => j.is_nft);
}

/**
 * Returns manifests of currently installed WebOns that have a contract in their dependencies
 * */
export async function getWebonsWithNFTInManifest(): Promise<NomoManifest[]> {
	let manifests: NomoManifest[];
	try {
		manifests = (await nomoGetInstalledWebOns()).manifests;
	} catch (e) {
		if (isFallbackModeActive()) {
			manifests = [];
		} else {
			throw e;
		}
	}

	const nftContractPrefix = 'nftcontract:';
	const filteredManifests = manifests.filter((man) => {
		return man.dependencies?.find((dep) => dep.startsWith(nftContractPrefix));
	});
	filteredManifests.forEach((man) => {
		if (man?.dependencies) {
			man.dependencies = man.dependencies
				.filter((dep) => dep.startsWith(nftContractPrefix))
				.map((dep) => dep.slice(nftContractPrefix.length));
		}
	});
	return filteredManifests;
}
