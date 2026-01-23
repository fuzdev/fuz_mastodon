<script lang="ts">
	import DocsFooter from '@fuzdev/fuz_ui/DocsFooter.svelte';
	import LibrarySummary from '@fuzdev/fuz_ui/LibrarySummary.svelte';
	import Card from '@fuzdev/fuz_ui/Card.svelte';
	import {library_context} from '@fuzdev/fuz_ui/library.svelte.js';
	import {resolve} from '$app/paths';
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {DEV} from 'esm-env';

	import Toot from '$lib/Toot.svelte';

	import {MastodonCache, mastodon_cache_context} from '$lib/mastodon_cache.svelte.js';

	let cache: MastodonCache | null = $state(null);

	if (DEV) {
		cache = mastodon_cache_context.set(
			new MastodonCache(
				async () => (await import('./mastodon_dev_cache_data.js')).mastodon_dev_cache_data,
			),
		);
		// To get the latest cache data, add these lines:
		// 		const cache = get_mastodon_cache();
		// 		if (typeof window !== 'undefined') window.cache = cache;
		// Then run this in the console and then click into the document to make the clipboard work: (and disable the `reply_filter` if you want all the data)
		// 		setTimeout(() => navigator.clipboard.writeText(JSON.stringify(Array.from(cache.data.entries()))), 500)
		// Then paste the string into the `mastodon_dev_cache_data.js` file as the exported `mastodon_dev_cache_data` value.
	}

	const library = library_context.get();

	const url = 'https://hci.social/@ryanatkn/111491794208793604';
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<main class="p_lg">
	<section class="box">
		<div class="panel p_lg mb_xl5 shadow_md shade_00">
			<LibrarySummary {library} />
		</div>
		<Card href={resolve('/docs')}>docs{#snippet icon()}{library.package_json.glyph}{/snippet}</Card>
	</section>
	<section class="width_atmost_md">
		<Code lang="ts" content={`import Toot from '@fuzdev/fuz_mastodon/Toot.svelte';`} />
		<Code
			content={`<Toot
	url="${url}"
	initial_autoload
	include_replies
	reply_filter={(item) => (
		{type: 'favourited_by', favourited_by: [item.account.acct]}
	)}
	settings_storage_key="example_1"
	cache={cache?.data}
/>`}
		/>
	</section>
	<section class="width_atmost_sm">
		{#if !cache || cache.data !== undefined}
			<Toot
				{url}
				initial_autoload
				include_replies
				reply_filter={(item) => ({type: 'favourited_by', favourited_by: [item.account.acct]})}
				settings_storage_key="example_1"
				cache={cache?.data}
			/>
		{/if}
	</section>
	<section class="width_atmost_md">
		<h2>Allowlisting replies with custom rules</h2>
		<p>
			By default, no replies are included. You can opt into including replies with <code
				>include_replies</code
			>
			and customize them with <code>reply_filter</code>.
		</p>
		<h3>Allow all</h3>
		<p>Adding <code>include_replies</code> enables all replies by default.</p>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
/>`}
		/>
		<p>
			This is the default value for <code>reply_filter</code>. It does nothing here but it's shown
			for clarity.
		</p>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={() => (
		{type: 'custom', should_include: () => true}
	)}
/>`}
		/>
		<h3>Allow if favourited by specific accounts</h3>
		<p>You can provide a list of names whose favourites cause the reply to be shown.</p>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={() => (
		{type: 'favourited_by', favourited_by: ['username1', 'user2']}
	)},
/>`}
		/>
		<h3>Allow if favourited by the root status author</h3>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={(item) => (
		{type: 'favourited_by', favourited_by: [item.account.acct]}
	)},
/>`}
		/>
		<h3>Allow with a mimimum number of favourites</h3>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={() => (
		{type: 'minimum_favourites', minimum_favourites: 3}
	)},
/>`}
		/>
		<h3>Allow on custom conditions</h3>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={() => (
		{
			type: 'custom',
			should_include: (item, root_status, status_context) => {
				/* return boolean */
			})
		}
	)},
/>`}
		/>
		<h3>Allow on multiple conditions</h3>
		<p>Replies are included if <strong>any</strong> filter passes.</p>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={(item) => [
		{type: 'favourited_by', favourited_by: ['trusted', 'tasteful']},
		{type: 'minimum_favourites', minimum_favourites: 10},
		{type: 'custom', should_include: () => Math.random() > 0.5)}
	]},
/>`}
		/>
		<h3>Allow none</h3>
		<p>Simply omit <code>include_replies</code>:</p>
		<Code content={`<Toot	url="${url}" />`} />
		<p>
			Or pass <code>null</code> or <code>undefined</code> or <code>[]</code> for
			<code>reply_filter</code>:
		</p>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={null}
/>`}
		/>
		<p>
			Or return no filters (<code>null</code> or <code>undefined</code> or <code>[]</code>):
		</p>
		<Code
			content={`<Toot
	url="${url}"
	include_replies
	reply_filter={() => null}
/>`}
		/>
	</section>
	<div class="my_xl5">
		<DocsFooter {library} root_url="https://www.fuz.dev/">
			{#snippet logo_header()}
				<a class="mb_xs" href={resolve('/about')}>about</a>
			{/snippet}
		</DocsFooter>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}
	section {
		margin: var(--space_xl5) 0;
	}
</style>
