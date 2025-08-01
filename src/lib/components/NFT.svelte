<script lang="ts">
	import type { ExtendedNft } from '$lib/types/Nft';
	import { nft_default } from '$lib/assets';
	import { goto } from '$app/navigation';
	import { clickedStore } from '$lib/store/clickedStore';
	import { getNftName } from '$lib/helper/name-replace';

	export let NFT: ExtendedNft;
</script>

<button
	class="Nft-Wrapper"
	on:click={() => {
		clickedStore.set(NFT);
		goto('/show');
	}}
>
	<img
		src={NFT?.omonNFT?.webons?.at(0)
			? `https://${NFT.omonNFT.webons.at(0)}/nomo_icon.svg`
			: nft_default}
		alt="Webon"
		on:error={(e) => {
			if (e?.target?.src) e.target.src = nft_default;
		}}
	/>
	<span class="content-wrapper">
		<div class="name">{getNftName(NFT)}</div>
		{#if (+NFT?.baseNFT?.balance) > 1}
			<div>Count: {NFT?.baseNFT?.balance}</div>
		{/if}
		<!--	<span class="address">{NFT?.nft?.contractAddress ?? 'Missing address'}</span>-->
		<span class="main_btn no-select">Details</span>
	</span>
</button>

<style lang="scss">
	.Nft-Wrapper {
		height: 100%;
		color: unset;
		text-decoration: none;
		border: none;
		outline: none;
		background: none;
		text-align: start;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background: var(--custom_surface);
		& > img {
			//border-radius: 10px;
			//width: 100%;
			padding-bottom: 10px;
			max-width: 300px;
			max-height: 300px;
			//border: 1px solid red;
		}
	}
	.content-wrapper {
		width: 100%;
		height: 100%;
		text-align: start;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 5px;
	}
	.address {
		font-size: 0.8rem;
		word-break: break-all;
	}
	.name {
		font-size: 1rem;
	}
	.main_btn {
		margin-top: 5px;
		font-size: 16px;
		box-shadow: 0 1px 1px var(--shadow);
		height: 45px;
	}
</style>
