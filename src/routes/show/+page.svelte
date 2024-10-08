<script lang="ts">
	import type { ExtendedNft } from '$lib/types/Nft';
	import { onMount } from 'svelte';
	import {
		type NomoEvmNetwork,
		nomoGetEvmAddress,
		nomoGetInstalledWebOns,
		nomoInstallWebOn,
		nomoLaunchWebOn,
		nomoRegisterOnWebOnVisible
	} from 'nomo-webon-kit';
	import Loading from '$lib/components/Loading.svelte';
	import { avinoc, nft_default } from '$lib/assets';
	import TopBar from '$lib/components/TopBar.svelte';
	import { clickedStore, selectedChain, selectedNFTIdStore } from '$lib/store/clickedStore';
	import { goto } from '$app/navigation';
	import { avinoc_contract, avinoc_contract_eth } from '$lib/helper/constants';
	import { type ERC721Entity, nomoFetchERC721 } from '$lib/web3/nft-id-fetching';
	import NFTIDElement from '$lib/components/NFTIDElement.svelte';
	import { zscProvider } from 'ethersjs-nomo-webons';
	import { ethers } from 'ethers';
	import { getNftName } from '$lib/helper/name-replace';

	let NFT: ExtendedNft;
	let loading = true;
	let tokenIds: ERC721Entity[] | undefined;
	let isContactAvinoc = false;
	let chain: NomoEvmNetwork;
	let webonImg = nft_default;

	$: if (NFT) {
		isContactAvinoc =
			NFT.baseNFT.contractAddress === avinoc_contract ||
			NFT.baseNFT.contractAddress === avinoc_contract_eth;
	}
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
		webonImg = isContactAvinoc
			? avinoc
			: NFT.omonNFT?.webons?.at(0)
				? `https://${NFT.omonNFT?.webons.at(0)}/nomo_icon.svg`
				: nft_default;
	}
	onMount(() =>
		nomoRegisterOnWebOnVisible(() => {
			findManifestForNFT();
			fetchIds();
		})
	);
	onMount(async () => {
		NFT = $clickedStore;
		if (!NFT) {
			goto('./');
			return;
		}
		await fetchIds();
		findManifestForNFT();
		loading = false;
	});

	async function fetchIds() {
		const add = await nomoGetEvmAddress();

		if (true) {
			const provider = chain === 'ethereum' ? ethers.getDefaultProvider() : zscProvider;
			tokenIds = await nomoFetchERC721({
				provider: provider,
				nftContractAddress: NFT.baseNFT.contractAddress,
				evmAddress: add
			});
		}
	}

	async function findManifestForNFT() {
		const nftHost = NFT?.omonNFT?.webons?.at(0)?.trim()?.toLowerCase();
		const nftContractAddress = NFT.omonNFT?.contractAddress?.toLowerCase();

		const { manifests } = await nomoGetInstalledWebOns();
		let found_webon = false;
		manifests.forEach((manifest) => {
			manifest.dependencies?.forEach(async (dep) => {
				if (nftContractAddress && dep.toLowerCase().includes(nftContractAddress)) {
					NFT.manifest = manifest;
					found_webon = true;
				}
			});
			if (nftHost) {
					const manifestHost = new URL(manifest.webon_url).host;
					if (manifestHost === nftHost) {
						NFT.manifest = manifest;
						found_webon = true;
					}
			}
		});
		if (!found_webon) {
			NFT.manifest = null;
		}
	}

	async function launchWebon() {
		const installedWebons = await nomoGetInstalledWebOns();

		let webon = installedWebons.manifests.find(
			(w) => {
				const manifestHost = new URL(w.webon_url).host;
				const nftHost = NFT.omonNFT.webons[0]?.trim()?.toLowerCase();
				return manifestHost === nftHost;
			}
		);

		if (webon) {
			await nomoLaunchWebOn({ manifest: webon, payload: '' });
		} else alert("Coudn't find webon please make sure it is installed.");
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
	function gotoSend() {
		if (!tokenIds?.length) return;
		selectedNFTIdStore.set(tokenIds[0].tokenID);
		goto('/send');
	}
</script>

{#if loading}
	<Loading />
{:else if NFT}
	<TopBar heading="NFT" />
	<div class="Nft-Wrapper">
		<img
			src={webonImg}
			alt="Webon"
			on:error={(e) => {
				if (e?.target?.src) e.target.src = nft_default;
			}}
		/>
		<div class="name">{getNftName(NFT)}</div>
		<div class="label">Contract Address</div>
		<div class="contract">{NFT?.baseNFT?.contractAddress ?? 'Missing address'}</div>
		{#if (+NFT?.baseNFT?.balance ?? 0) > 1}
			<div class="label">Balance</div>
			<div class="contract">{NFT?.baseNFT?.balance ?? '1'}</div>
		{:else if (+NFT?.baseNFT?.balance ?? 0) === 1 && tokenIds?.length === 1}
			<div class="label">ID</div>
			<div class="contract">{tokenIds[0].tokenID}</div>
		{/if}
		{#if NFT.omonNFT?.webons.at(0)}
			<div class="label">Webon</div>
			<div class="contract">{NFT.omonNFT?.webons.at(0)}</div>
		{/if}
		{#if !tokenIds || tokenIds.length === 1}
			{#if NFT.manifest?.webon_url}
				<div class="main_btn no-select" on:click={launchWebon}>Open Webon</div>
			{:else if NFT.omonNFT?.webons?.at(0)}
				<div class="main_btn no-select top_btn" on:click={installWebon}>Add Webon</div>
			{/if}
			{#if NFT.omonNFT && !NFT.omonNFT?.not_transferable && tokenIds?.length}
				<div class="main_btn send_btn no-select" on:click={gotoSend}>Send NFT</div>
			{/if}
		{/if}
	</div>
	{#if tokenIds && tokenIds?.length && tokenIds.length > 1}
		<div class="NFT-id-wrapper">
			{#each tokenIds as tokenId}
				<NFTIDElement bind:NFT bind:tokenId={tokenId.tokenID} />
			{/each}
		</div>
	{:else if !tokenIds}
		<Loading />
	{/if}
{:else}
	NO NFT FOUND
{/if}

<style lang="scss">
	.contract {
		padding: 5px 0 10px 0;
		color: var(--small_heading);
		word-break: break-all;
	}
	.Nft-Wrapper {
		background: var(--custom_surface);
		box-shadow: 0 0 15px var(--shadow_darker);
		padding: 25px 15px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		& > img {
			max-width: 200px;
			max-height: 200px;
			width: 100%;
			height: 100%;
			margin-inline: auto;
		}
	}
	.label {
		font-weight: bold;
		padding-top: 10px;
	}
	.name {
		font-weight: bold;
	}
	.send_btn {
		margin-top: 15px;
	}
	.NFT-id-wrapper {
		margin-top: 10px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
</style>
