<script lang="ts">
	import { onMount } from 'svelte';

	export let show_modal = true;
	export let onCloseCallback: Function | undefined = undefined;
	export let webon_domain: string;
	export let webon_name: string;
	let dialog: HTMLDialogElement;
	let error: string;
	async function onClose() {
		if (onCloseCallback) {
			const callback_error = await onCloseCallback();
			if (callback_error) {
				error = callback_error;
				return;
			}
		}
		closeModal();
	}
	function closeModal() {
		// dialog.close();
		// show_modal = false;
	}
	onMount(() => dialog.showModal());
</script>

<!--on:click|self={closeModal}-->
<dialog bind:this={dialog} on:close={closeModal}>
	<div class="modal-body">
		{#if error}
			<div class="error">{error}</div>
		{/if}
		<button class="close-btn" on:click={() => closeModal()}>
			<span class="close-btn__img"></span>
		</button>
		<slot />
		<br />
		<div class="button-container">
			<button
				id="modal-button"
				on:click={async (e) => {
					// e.target.disabled = true;
					await onClose();
					// e.target.disabled = false;
				}}
			>
				{webon_name}
			</button>
		</div>
	</div>
</dialog>

<style lang="scss">
	.close-btn {
		width: 30px;
		height: 30px;
		padding: 5px;
		box-sizing: border-box;
		border-radius: 100%;
		border: 1px solid #75767c33;
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 2;
		box-shadow: 0 1px 1px 1px #999;
		.close-btn__img {
			//background-image: url('../../assets/img/close-icon.svg');
			background-repeat: no-repeat;
			background-size: cover;
			width: 100%;
			height: 100%;
		}
	}
	dialog {
		background: var(--primaryContainer);
		max-width: min(32em, 90vw);
		height: 100px;
		border-radius: 15px;
		border: solid 1px #2d2d2fff;
		padding: 0;
		box-shadow: 0 3px 9px var(--vougee-gray);
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.modal-body {
		margin: 10px;
		.error {
			width: 100%;
			text-align: center;
			margin: 10px 0;
		}
		.button-container {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			button {
				cursor: pointer;
				border-radius: 1000px;
				background: var(--primary);
				color: var(--onPrimary);
				font-size: 15px;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10px 40px;
				border: solid var(--primaryContainer) 1px;
				transition: 0.2s;
				&:hover {
					background: var(--secondary);
				}
				&:disabled {
					background: var(--disabledColor);
					border: none;
					cursor: not-allowed;
				}
				&:focus-visible {
					outline: none;
				}
			}
		}
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
