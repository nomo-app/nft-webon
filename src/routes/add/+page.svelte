<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import { nomoLocalStorage } from 'nomo-webon-kit';
	import { goto } from '$app/navigation';

	let contract_address = '';
	async function onAdd() {
		if (!contract_address) return;

		let new_storage = [];
		let storage = await nomoLocalStorage.getItem('Local_Nfts');
		if (storage) new_storage = JSON.parse(storage) ?? [];
		new_storage.push({ nft: { contractAddress: contract_address } });
		nomoLocalStorage.setItem('Local_Nfts', JSON.stringify(new_storage));
		goto('/');
	}
</script>

<TopBar heading="Add NFT" />
<div class="Input_Wrapper">
	<div class="container">
		<div class="label">Contract Address</div>
		<input type="text" bind:value={contract_address} />
	</div>

	<div class="main_btn" on:click|preventDefault={() => onAdd()}>
		<span> &#xFF0B; </span>
		Add NFT
	</div>
</div>

<style lang="scss">
	.Input_Wrapper {
		display: flex;
		flex-direction: column;
		gap: 30px;
		box-shadow: 0 1px 5px var(--shadow_darker);
		padding: 20px;
		border-radius: 10px;
		.container {
			width: 100%;
			.label {
				color: var(--small_heading);
				padding-bottom: 10px;
			}
			input {
				padding: 15px 23px;
				font-size: 1.2rem;
				border: none;
				background: var(--input);
				border-radius: 5px;
				width: 100%;
				box-shadow: 0 1px 2px var(--shadow);
				transition: 0.4s;
				&:focus-within {
					outline: none;
					box-shadow: none;
				}
			}
		}

		.main_btn > span {
			padding-right: 10px;
		}
	}
</style>
