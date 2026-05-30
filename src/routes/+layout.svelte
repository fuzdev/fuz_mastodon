<script lang="ts">
	import 'virtual:fuz.css';
	import '@fuzdev/fuz_code/theme.css';
	import '$routes/style.css';

	import ThemeRoot from '@fuzdev/fuz_ui/ThemeRoot.svelte';
	import Dialog from '@fuzdev/fuz_ui/Dialog.svelte';
	import ContextmenuRoot from '@fuzdev/fuz_ui/ContextmenuRoot.svelte';
	import {contextmenu_attachment} from '@fuzdev/fuz_ui/contextmenu_state.svelte.js';
	import {Library, library_context} from '@fuzdev/fuz_ui/library.svelte.js';
	import {SiteState, site_context} from '@fuzdev/fuz_ui/site.svelte.js';
	import {logo_fuz_mastodon} from '@fuzdev/fuz_ui/logos.js';
	import {library_json_from_modules} from '@fuzdev/fuz_util/library_json.js';
	import {modules} from 'virtual:svelte-docinfo';

	import Settings from '$routes/Settings.svelte';
	import type {Snippet} from 'svelte';

	import package_json from '../../package.json' with {type: 'json'};

	const {
		children,
	}: {
		children: Snippet;
	} = $props();

	const library_json = library_json_from_modules(package_json, modules);

	library_context.set(new Library(library_json));
	site_context.set(
		new SiteState({
			icon: logo_fuz_mastodon,
			glyph: '🦣',
			repo_url: 'https://github.com/fuzdev/fuz_mastodon',
		}),
	);

	let show_settings = $state.raw(false);
</script>

<svelte:head>
	<title>@fuzdev/fuz_mastodon</title>
</svelte:head>

<svelte:body
	{@attach contextmenu_attachment([
		{
			snippet: 'text',
			props: {
				content: 'Settings',
				icon: '?',
				run: () => {
					show_settings = true;
				},
			},
		},
		{
			snippet: 'text',
			props: {
				content: 'Reload',
				icon: '⟳',
				run: () => {
					location.reload();
				},
			},
		},
	])}
/>

<ThemeRoot>
	<ContextmenuRoot>
		{@render children()}
		{#if show_settings}
			<Dialog onclose={() => (show_settings = false)}>
				<div class="pane p_md width_atmost_md mx_auto">
					<Settings />
				</div>
			</Dialog>
		{/if}
	</ContextmenuRoot>
</ThemeRoot>
