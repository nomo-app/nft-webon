<script lang="ts">
	import NFT from '$lib/components/NFT.svelte';
	import { coin } from '$lib/assets';
	import { nomoRegisterOnWebOnVisible } from 'nomo-webon-kit';
	import { prettyLogError } from '$lib/helper/logger';
	import type { ExtendedNft } from '$lib/types/Nft';
	import Loading from '$lib/components/Loading.svelte';
	import ChainSelection from '$lib/components/ChainSelection.svelte';
	import Sort from '$lib/components/Sort.svelte';
	import { clickedStore, selectedChain } from '$lib/store/clickedStore';
	import { fetchPolygonNFTs, fetchZENIQSmartchainNfts, getEthereumAvinocNfts } from '$lib/web3/nft-balance-fetching';
	import { fetchOmonNFTs } from '$lib/web3/nft-webon-fetching';
	import '$lib/backup-modal.js';
	import { getEvmAddress } from '$lib/web3/ethers-providers';


	let loading = true;
	let Nfts: ExtendedNft[] = [];
	let omonNFTs: any;
	let error = '';
	let rerender_key = {};

	$: if ($selectedChain) initNftGet();

	nomoRegisterOnWebOnVisible(() => initNftGet());

	async function initNftGet() {
		loading = true;
		try {
			omonNFTs = await fetchOmonNFTs();
		} catch (e) {
			error = 'Failed to fetch list of known NFTs.';
			return;
		}

		error = '';
		const address = await getEvmAddress();
		if (address) await fetchNFTs(address);
		clickedStore.set(undefined as any);
		rerender_key = {};
		loading = false;
	}

	async function fetchNFTs(address: string) {
		try {
			Nfts = [];
			if ($selectedChain === 'zeniq-smart-chain') {
				 Nfts = await fetchZENIQSmartchainNfts({address, omonNFTs});
			} else if ($selectedChain === 'ethereum') {
				 Nfts = (await getEthereumAvinocNfts({ address, omonNFTs })) as any as ExtendedNft[];
			} else if ($selectedChain === 'polygon') {
				 Nfts = (await fetchPolygonNFTs({ address, omonNFTs })) as any as ExtendedNft[];
			} else {
				throw Error(`Chain ${$selectedChain} not supported`);
			}
		} catch (e: any) {
			error = `Failed to fetch NFT balances for ${$selectedChain}`;
			prettyLogError(e);
		}
	}
</script>

<div class="Main-Wrapper">
	<div class="heading">
		<img src={coin} alt="coin" />
		<span class="text">NFTs</span>
	</div>
	<div class="filter">
		<ChainSelection />
		<Sort bind:Nfts />
	</div>
	{#if error}
		<div class="error error_heading">An error occurred!</div>
		<div class="error">{error}</div>
	{:else if loading}
		<Loading />
	{:else}
		<div class="Nfts-Wrapper">
			{#key rerender_key}
				{#if Nfts?.length}
					{#each Nfts as nft}
						<NFT bind:NFT={nft} />
					{/each}
				{:else}
					<div class="no-nfts">You do not have any NFTs on this chain</div>
				{/if}
			{/key}
		</div>
	{/if}
</div>

<!--<div class="Add-Wrapper">
	<button on:click={() => goto('/add')} class="main_btn">
		<span> &#xFF0B; </span>
		Add NFT
	</button>
</div>-->

<style lang="scss">
	.Main-Wrapper {
		& > .heading {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			max-width: 100vw;
			& > img {
				width: 60px;
				height: 60px;
			}
		}
		& > .filter {
			display: flex;
			flex-direction: row;
			padding-bottom: 30px;
			justify-content: end;
			width: 100%;
			gap: 20px;
			color: var(--text_always_dark);

			.view {
				background-image: url('$lib/assets/list.svg');
				background-repeat: no-repeat;
				background-position-x: 15%;
				background-position-y: 50%;
				background-size: 18px;
				padding: 15px 15px 15px 50px;
			}
		}
		& > .Nfts-Wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-gap: 20px;
		}
	}
	.Add-Wrapper {
		box-shadow: 0 -1px 3px var(--shadow);
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--background);
		padding-inline: 20px;
		& > .main_btn {
			max-width: 600px;
			& > span {
				padding-right: 10px;
			}
		}
	}
	.no-nfts {
		font-size: 1.2rem;
		padding-top: 20px;
		font-weight: bold;
		margin-inline: auto;
	}
	.Nfts-Wrapper:has(> .no-nfts) {
		display: flex;
	}
</style>
