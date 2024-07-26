<script lang="ts">
	import { Jumper } from 'svelte-loading-spinners';
	export let themeColor = '#bca570ff';
	export let size = '60';
</script>

<div class="loading-wrapper">
	<Jumper bind:size color={themeColor} unit="px" duration="1s" />
</div>

<style lang="scss">
	.loading-wrapper {
		height: 30vh;
		justify-content: center;
		align-items: center;
		display: flex;
	}
</style>
