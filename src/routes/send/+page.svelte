<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { clickedStore, selectedChain, selectedNFTIdStore } from '$lib/store/clickedStore';
	import type { ExtendedNft } from '$lib/types/Nft';
	import Loading from '$lib/components/Loading.svelte';
	import { Contract, ethers } from 'ethers';
	import { nomoGetEvmAddress, nomo } from 'nomo-webon-kit';
	import { EthersjsNomoSigner, zscProvider } from 'ethersjs-nomo-webons';
	import { invokeNomoFunction } from 'nomo-webon-kit/dist/dart_interface';

	let receiverAddress = '';
	let tokenId: number;
	let inputError = '';
	let loading = true;
	let NFT: ExtendedNft;
	let successMsg = '';
	let loadingBtn = false;
	$: tokenId = $selectedNFTIdStore;
	onMount(() => {
		NFT = $clickedStore;
		if (!NFT) {
			goto('./');
			return;
		}

		loading = false;
	});

	function getProvider() {
		switch ($selectedChain) {
			case 'ZSC':
				return zscProvider;
			case 'ETH':
				return ethers.getDefaultProvider();
		}
	}

	async function getTransferContract(): Promise<Contract> {
		const provider = getProvider();
		if (!provider) throw new Error('No valid provider!');
		const signer = new EthersjsNomoSigner(provider);
		return new ethers.Contract(
			NFT.baseNFT.contractAddress,
			[`function safeTransferFrom(address from, address to, uint256 tokenId) external`],
			signer
		);
	}
	async function getOwnerOfContract(): Promise<Contract> {
		const provider = getProvider();
		if (!provider) throw new Error('No valid provider!');
		return new ethers.Contract(
			NFT.baseNFT.contractAddress,
			['function ownerOf(uint256 tokenId) view returns (address)'],
			provider
		);
	}

	async function nomoResolveName(args: {name: string}): Promise<{address: string; nameService: string}> {
		return await invokeNomoFunction('nomoResolveName', args);
	}

	async function sendNft() {
		loadingBtn = true;
		if (!receiverAddress) {
			inputError = "Please enter the receiver's address!";
			loadingBtn = false;
			return;
		}
		if (typeof tokenId !== 'bigint' && typeof tokenId !== 'number') {
			inputError = 'Please enter a token ID!';
			loadingBtn = false;
			return;
		}
		receiverAddress = receiverAddress.trim();
		if (receiverAddress.endsWith('.eth') || receiverAddress.endsWith('.znq')) {
			const name = receiverAddress;
			receiverAddress = (await nomoResolveName({name})).address;
			if (!receiverAddress) {
				receiverAddress = name;
				inputError = 'Name could not be found!';
				loadingBtn = false;
				return;
			}
		}
		if (receiverAddress.includes("?")) {
			// enable scanning of non-raw receive-addresses from Nomo
			receiverAddress = receiverAddress.split("?")[0];
		}
		if (!ethers.isAddress(receiverAddress)) {
			inputError = 'Please enter a valid Address!';
			loadingBtn = false;
			return;
		}
		const ownerContract = await getOwnerOfContract();
		const nvm = await nomoGetEvmAddress();
		const isOwner = (await ownerContract.ownerOf(tokenId))?.toLowerCase();

		if (isOwner && isOwner.toLowerCase() !== nvm.toLowerCase()) {
			inputError = 'You do not own an NFT with that token ID!';
			loadingBtn = false;
			return;
		}
		inputError = '';
		try {
			const transferContract = await getTransferContract();
			const address = nomoGetEvmAddress();
			await transferContract.safeTransferFrom(address, receiverAddress, tokenId, { gasLimit: 250000 });
		} catch (e) {
			console.error(e);
			inputError = 'Failed to send NFT!';
			loadingBtn = false;
			return;
		}
		setTimeout(() => {
			successMsg = 'Successfully sent NFT!';
			tokenId = undefined;
			loadingBtn = false;
			clickedStore.set(null);
		}, 500);
	}

	async function onClickScan() {
		const qrCode = (await nomo.qrScan()).qrCode.trim();
		receiverAddress = qrCode;
	}
</script>

{#if loading}
	<Loading />
{:else}
	<TopBar heading="Send NFT" />
	<div class="Input_Wrapper">
		{#if inputError}
			<div class="error">{inputError}</div>
		{/if}
		{#if successMsg}
			<div class="success">{successMsg}</div>
		{/if}
		<div class="container">
			<div class="label">Receiver Address</div>
			<div style="display: flex;align-items: center;background-color: #eeeeee;">
				<input type="text" bind:value={receiverAddress} >
				<img src="ic_scan.svg" alt="scan icon" style="margin:8px;" on:click={() => onClickScan()}/>
			</div>
			<div class="label">Token ID</div>
			<input type="number" bind:value={tokenId} disabled />
		</div>
		<div class="main_btn" on:click={() => sendNft()}>
			{#if loadingBtn}
				<Loading size="40" themeColor="white" />
			{:else}
				Send NFT
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.Input_Wrapper {
		display: flex;
		flex-direction: column;
		gap: 30px;
		box-shadow: 0 1px 5px var(--shadow_darker);
		padding: 20px;
		border-radius: 10px;
		background: var(--surface);
		.container {
			width: 100%;
			.label {
				color: var(--small_heading);
				padding: 12px 0 5px 0;
				&:first-of-type {
					padding-top: 0;
				}
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
	}
	.success {
		color: var(--primary);
		text-align: center;
		font-weight: bold;
	}
</style>
