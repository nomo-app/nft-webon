<script lang="ts">
	import { avinoc_contract, avinoc_contract_eth } from '$lib/helper/constants';
	import { nomoGetInstalledWebOns, nomoInstallWebOn, nomoLaunchUrlAsWebOn } from 'nomo-webon-kit';
	import { goto } from '$app/navigation';
	import type { ExtendedNft } from '$lib/types/Nft';
	import { selectedChain, selectedNFTIdStore } from '$lib/store/clickedStore';

	export let NFT: ExtendedNft;
	export let tokenId: bigint;
	let isContactAvinoc = false;
	let chain = '';
	$: if ($selectedChain) {
		switch ($selectedChain) {
			case 'ZSC':
				chain = 'zeniq-smart-chain';
				break;
			case 'ETH':
				chain = 'ethereum';
				break;
		}
	}
	$: if (NFT) {
		isContactAvinoc =
			NFT.baseNFT.contractAddress === avinoc_contract ||
			NFT.baseNFT.contractAddress === avinoc_contract_eth;
	}

	async function launchWebon() {
		const installedWebons = await nomoGetInstalledWebOns();

		let webon = installedWebons.manifests.find(
			(w) => {
				const installedHost = new URL(w.webon_url).host;
				if (!NFT.manifest) {
					return false;
				}
				const nftHost = new URL(NFT.manifest.webon_url).host;
				return installedHost === nftHost;
			}
		);

		if (webon && isContactAvinoc && NFT.manifest) {
			await nomoLaunchUrlAsWebOn({
				manifest: {
					...NFT.manifest,
					webon_url: `https://defi.avinoc.com#/claiming?nftid=${tokenId}&network=${chain}`
				}
			});
		} else if (webon) {
			await nomoLaunchUrlAsWebOn({ manifest: NFT.manifest });
		} else {
			alert("Coudn't find webon please make sure it is installed.");
		}
	}
	function gotoSend() {
		selectedNFTIdStore.set(tokenId);
		goto('/send');
	}
	async function installWebon() {
		if (!NFT?.omonNFT?.webons?.at(0)) {
			alert('Could not find webon deeplink!');
			return;
		}
		nomoInstallWebOn({
			deeplink: 'https://' + NFT.omonNFT.webons.at(0),
			skipPermissionDialog: false,
			navigateBack: false,
		});
	}
</script>

<div class="Nft-Wrapper additional">
	<div class="label">ID</div>
	<div class="contract">{tokenId}</div>
	{#if NFT.manifest?.webon_url}
		<div class="main_btn no-select top_btn" on:click={launchWebon}>Open Webon</div>
	{:else if NFT.omonNFT?.webons.at(0)}
		<div class="main_btn no-select top_btn" on:click={installWebon}>Add Webon</div>
	{/if}
	{#if NFT?.omonNFT && !NFT?.omonNFT?.not_transferable}
		<div class="main_btn send_btn no-select" on:click={gotoSend}>Send NFT</div>
	{/if}
</div>

<style lang="scss">
	.Nft-Wrapper {
		background: var(--custom_surface);
		box-shadow: 0 0 5px var(--shadow_darker);
		padding: 25px 15px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
	}
	.label {
		font-weight: bold;
		padding-top: 10px;
	}
	.contract {
		padding: 5px 0 10px 0;
		color: var(--small_heading);
		word-break: break-all;
	}
	.main_btn {
		font-size: 1rem;
		height: 45px;
		margin-top: 10px;
	}
</style>
