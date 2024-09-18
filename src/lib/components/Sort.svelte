<script lang="ts">
	import type { ExtendedNft, BaseNFT } from '$lib/types/Nft';

	export let Nfts: ExtendedNft[];
	const sortList = ['A-Z', 'Z-A'];
	let sortBy = 'A-Z';

	$: if (sortBy && Nfts) {
		handleSort();
	}

	function handleSort() {
		Nfts.sort((a, b) => {
			switch (sortBy) {
				case 'A-Z':
					return sortByMetric(a.baseNFT, b.baseNFT, 'name', true);
				case 'Z-A':
					return sortByMetric(a.baseNFT, b.baseNFT, 'name', false);
				default:
					return 0;
			}
		});
		Nfts = Nfts;
	}

	function sortByMetric(a: BaseNFT, b: BaseNFT, metric: keyof BaseNFT, isAscending: boolean) {
		if (a[metric] > b[metric]) return isAscending ? 1 : -1;
		else if (a[metric] < b[metric]) return isAscending ? -1 : 1;
		else return 0;
	}
</script>

<select class="no-select" bind:value={sortBy}>
	<!--	<img src={arrowDown} alt="" class:descending={!sortNameAscending} />-->
	<optgroup label="Sort by">
		{#each sortList as sortable}
			<option>{sortable}</option>
		{/each}
	</optgroup>
</select>

<style lang="scss">
	select {
		border: none;
		border-radius: 5px;
		font-size: 1rem;
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		box-shadow: 0 1px 2px var(--shadow_darker);
		transition: 0.4s;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15px;
		background-image: url('$lib/assets/sort.svg');
		background-position: right 15px bottom 50%;
		background-size: 20px;
		background-repeat: no-repeat;
		padding: 15px 25px;
		width: 0;
		z-index: 10;

		& > img {
			width: 15px;
			//transition: 0.2s;
			&.descending {
				rotate: 180deg;
			}
		}
		&:active,
		&:focus-visible {
			outline: none;
		}
		&:active {
			box-shadow: none;
		}
	}
</style>
