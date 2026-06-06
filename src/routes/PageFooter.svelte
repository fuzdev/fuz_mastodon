<script lang="ts">
	import Breadcrumb from '@fuzdev/fuz_ui/Breadcrumb.svelte';
	import DocsFooter from '@fuzdev/fuz_ui/DocsFooter.svelte';
	import type {Library} from '@fuzdev/fuz_ui/library.svelte.js';
	import {site_context} from '@fuzdev/fuz_ui/site.svelte.js';
	import {FUZ_DEV_URL} from '@fuzdev/fuz_ui/constants.js';

	const {
		library,
	}: {
		library: Library;
	} = $props();

	const site = site_context.get();
</script>

<footer>
	<nav>
		<Breadcrumb />
	</nav>
	{#if library.pkg_json}
		<DocsFooter repo_url={site.repo_url} root_url={FUZ_DEV_URL} />
	{/if}
</footer>

<style>
	footer {
		margin-bottom: var(--space_xl7);
	}
	nav {
		font-size: var(--font_size_lg);
		margin-top: var(--space_xl3);
	}
</style>
