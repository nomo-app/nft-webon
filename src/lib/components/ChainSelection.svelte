<script lang="ts">
	import { arrowDown, eth, polygon, zeniq } from '$lib/assets';
	import { selectedChain } from '$lib/store/clickedStore';

	let chain_image: string;
	// TODO ADD ACTUAL FUNCTIONALITY

	const chain_list = [
		{
			name: 'Zeniq',
			value: 'ZSC'
		},
		{
			name: 'Ethereum',
			value: 'ETH'
		}
		// {
		// 	name: 'Polygon',
		// 	value: 'POLYGON'
		// }
	];

	$: if ($selectedChain) {
		switch ($selectedChain) {
			case 'ZSC':
				chain_image = zeniq;
				break;
			case 'POLYGON':
				chain_image = polygon;
				break;
			case 'ETH':
				chain_image = eth;
				break;
		}
	}
</script>

<div class="select-wrapper">
	<img src={chain_image} alt="chain" class="chain-img" />
	<select class="view no-select" bind:value={$selectedChain}>
		{#each chain_list as chain}
			<option value={chain.value}>
				{chain.name}
			</option>
		{/each}
		<!--TODO KANN DAS WEG?-->
		<option disabled>More chains available soon</option>
	</select>
	<img src={arrowDown} alt="open select" />
</div>

<style lang="scss">
	.select-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		background: none;
		& > img {
			position: absolute;
			width: 20px;
			height: 20px;
			right: 15px;
			top: 16px;
			font-weight: normal;
			pointer-events: none;
		}
		.chain-img {
			left: 10px;
			top: 5px;
			width: 40px;
			height: 40px;
			margin: auto 0;
		}
	}
	select {
		border: none;
		border-radius: 5px;
		font-size: 1.2rem;
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		box-shadow: 0 1px 2px var(--shadow_darker);
		transition: 0.4s;

		padding: 15px 15px 15px 55px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15px;
		width: 100%;
		font-weight: bold;
		color: #252837;
		&:active,
		&:focus-visible {
			outline: none;
		}

		&:active {
			box-shadow: none;
		}
	}
	option:last-of-type:after {
		display: none;
		content: none;
		background: none;
	}
</style>
