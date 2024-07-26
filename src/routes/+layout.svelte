<script lang="ts">
	import '$lib/style/global.scss';
	import '$lib/style/variables.scss';
	import '$lib/style/utils.scss';
	import { onMount } from 'svelte';
	import {
		getCurrentNomoTheme,
		nomoFallbackQRCode,
		nomoRegisterOnWebOnVisible
	} from 'nomo-webon-kit';
	let theme = 'LIGHT';
	async function getTheme() {
		theme = (await getCurrentNomoTheme()).name;
	}
	onMount(async () => {
		if (window.location.protocol !== "http:") {
      nomoFallbackQRCode();
    }
		getTheme();
	});
	nomoRegisterOnWebOnVisible(() => getTheme());
</script>

<div class={`Outest-Wrapper ${theme === 'LIGHT' ? 'Light' : 'Dark'}`}>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.content {
		max-width: 600px;
		margin-inline: auto;
		background: var(--background);
	}
</style>
