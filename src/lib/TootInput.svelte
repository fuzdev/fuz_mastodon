<script lang="ts">
	import Alert from '@fuzdev/fuz_ui/Alert.svelte';
	import {slide} from 'svelte/transition';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import {parse_mastodon_status_url} from './mastodon.js';

	let {
		url = $bindable(),
		attrs,
	}: {
		url: string;
		attrs?: SvelteHTMLElements['input'] | undefined;
	} = $props();

	const parsed = $derived(parse_mastodon_status_url(url));
	const invalid = $derived(!!(url && !parsed));
</script>

<fieldset>
	<div class="row" class:mb_lg={invalid}>
		<label title="where to load the toot" class="flex:1 row">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="icon_button box mr_lg" style:font-size="var(--font_size_xl)" href={url || undefined}
				>🔗</a
			>
			<input
				bind:value={url}
				placeholder="> toot url"
				onfocus={(e) => e.currentTarget.select()}
				{...attrs}
			/>
		</label>
	</div>
	{#if invalid}
		<div transition:slide>
			<Alert status="error">invalid Mastodon status url</Alert>
		</div>
	{/if}
</fieldset>
