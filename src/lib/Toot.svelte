<script lang="ts">
	import PendingButton from '@fuzdev/fuz_ui/PendingButton.svelte';
	import {slide} from 'svelte/transition';
	import {intersect} from '@fuzdev/fuz_ui/intersect.svelte.js';
	import type {FetchValueCache} from '@fuzdev/fuz_util/fetch.js';
	import type {Logger} from '@fuzdev/fuz_util/log.js';
	import type {Snippet} from 'svelte';

	import MastodonStatusTree from './MastodonStatusTree.svelte';
	import MastodonStatusItem from './MastodonStatusItem.svelte';
	import TootLoader from './TootLoader.svelte';
	import {load_from_storage, set_in_storage} from './storage.js';
	import {
		parse_mastodon_status_url,
		type CreateReplyFilters,
		type ReplyFilter,
	} from './mastodon.js';
	import TootInput from './TootInput.svelte';

	// TODO some of this may be broken after the Svelte 5 upgrade, the patterns are a mess

	// TODO maybe these shouldn't be bindable?
	let {
		url,
		updated_url = $bindable(url),
		include_ancestors = false,
		include_replies = false,
		reply_filter,
		cache,
		log,
		loading = $bindable(),
		load_time = $bindable(),
		settings_storage_key,
		initial_show_settings = false,
		show_settings = $bindable(),
		autoload_storage_key = 'autoload',
		initial_autoload = false,
		autoload = autoload_storage_key
			? load_from_storage(autoload_storage_key, () => initial_autoload)
			: initial_autoload,
		onreset,
		settings,
	}: {
		url: string; // TODO @many rethink these names, maybe remove `initial` and change the other to `updated`? inconsistency with url and settings/autoload
		/**
		 * Defaults to the `url`, but can be updated by user input.
		 */
		updated_url?: string; // TODO @many rethink these names, maybe remove `initial` and change the other to `updated`? inconsistency with url and settings/autoload
		/**
		 * Whether to fetch and display the ancestors in the status context.
		 */
		include_ancestors?: boolean;
		/**
		 * Whether to fetch and display replies aka descendants in the status context.
		 */
		include_replies?: boolean;
		/**
		 * Get a list of rules that controls whether replies are shown or not.
		 */
		reply_filter?: ReplyFilter | Array<ReplyFilter> | CreateReplyFilters | null;
		/**
		 * Optional API result cache.
		 * See `MastodonCache` and `get_mastodon_cache`/`set_mastodon_cache`.
		 */
		cache?: FetchValueCache | null | undefined;
		/**
		 * Optional logger for network calls.
		 */
		log?: Logger | undefined;
		/**
		 * @readonly
		 */
		loading?: boolean | undefined;
		/**
		 * @readonly
		 */
		load_time?: number | undefined;
		settings_storage_key?: string | undefined;
		initial_show_settings?: boolean; // TODO @many rethink these names, maybe remove `initial` and change the other to `updated`? inconsistency with url and settings/autoload
		show_settings?: boolean; // TODO @many rethink these names, maybe remove `initial` and change the other to `updated`? inconsistency with url and settings/autoload
		autoload_storage_key?: string | undefined;
		initial_autoload?: boolean; // TODO @many rethink these names, maybe remove `initial` and change the other to `updated`? inconsistency with url and settings/autoload
		autoload?: boolean; // TODO @many rethink these names, maybe remove `initial` and change the other to `updated`? inconsistency with url and settings/autoload
		onreset?: () => void;
		settings?: Snippet;
	} = $props();

	let loaded_status_key = $state(1);

	export const reset = (): void => {
		loaded_status_key++;
		updated_url = url;
		// these get bound but their values stick because they're optional, so reset them
		loading = undefined;
		load_time = undefined;
		onreset?.();
	};

	// TODO refactor with storage helpers with serialize/parse as options, locallyStored?
	const show_settings_key = $derived(
		settings_storage_key && 'show_settings' + settings_storage_key,
	);

	$effect(() => {
		if (show_settings === undefined) {
			show_settings = show_settings_key
				? load_from_storage(show_settings_key, () => initial_show_settings)
				: initial_show_settings;
		}
	});

	$effect(() => {
		if (show_settings_key) {
			set_in_storage(show_settings_key, show_settings); // TODO @many wastefully sets on init
		}
	});

	const toggle_settings = () => {
		show_settings = !show_settings;
	};

	$effect(() => {
		if (autoload_storage_key) {
			set_in_storage(autoload_storage_key, autoload); // TODO @many wastefully sets on init and across multiple `Toot` instances if bound
		}
	});

	const parsed = $derived(parse_mastodon_status_url(updated_url));
	const id = $derived(parsed?.status_id ?? null);
	const host = $derived(parsed?.host ?? null);

	const enable_load = $derived(loading !== false && !!host);

	const enable_reset = $derived(loading !== undefined || updated_url !== url);
</script>

{#key loaded_status_key}
	<TootLoader
		{host}
		{id}
		{include_ancestors}
		{include_replies}
		{cache}
		{log}
		{reply_filter}
		bind:loading
		bind:load_time
	>
		{#snippet children({item, status_context, replies, load, loading, load_time})}
			<!-- TODO this transition is working on my blog but not on this docs website, what's going on? I tried it on `/about` too -->
			<!-- TODO techically this class should probably be added based on `include_replies`, and display an error if they're null, meaning failed to load -->
			<div class="toot" class:replies transition:slide>
				<div class="toot_content">
					{#if include_ancestors && status_context}
						<div transition:slide>
							<!-- TODO style differently or something -->
							{#each status_context.ancestors as ancestor (ancestor.id)}
								<MastodonStatusItem item={ancestor} />
							{/each}
						</div>
					{/if}
					<div class="main_post panel">
						<div class="panel bg_panel">
							{#if item}
								<!-- TODO Svelte 5 animation bug - keeping this one here because the alternative is a janky animation,
									and it's not as bad for UX as the contentwarning one below -->
								<div class="transition_wrapper" transition:slide>
									<MastodonStatusItem {item} --margin="0" />
								</div>
							{:else}
								<div class="transition_wrapper" transition:slide>
									<PendingButton
										pending={loading || false}
										disabled={!enable_load}
										onclick={() => load()}
									>
										<div class="icon_button_content">
											<div class="icon">🦣</div>
											<div class="button_content">
												<div>
													load toot{#if include_replies || include_ancestors}s{/if} from
												</div>
												<code class="ellipsis"
													>{#if host}{host}{:else}invalid url{/if}</code
												>
											</div>
										</div>
									</PendingButton>
								</div>
							{/if}
						</div>
					</div>
					{#if item && replies}
						<!-- TODO Svelte 5 animation bug -->
						<!-- <div transition:slide> -->
						<MastodonStatusTree {item} items={replies} />
						<!-- </div> -->
					{/if}
				</div>
				{#if item}
					<div transition:slide class="pb_md">
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={item.url} rel="noreferrer" class="display:block panel p_md">
							<span class="font_family_mono">↪︎</span> reply on Mastodon
						</a>
					</div>
				{/if}
				<div class="toot_controls">
					<div
						class="controls"
						{@attach intersect(() => ({
							onintersect: ({intersecting}) => {
								if (intersecting && autoload) load();
							},
							count: 1,
						}))}
					>
						<div class="row">
							<button
								type="button"
								onclick={toggle_settings}
								class="deselectable"
								class:selected={show_settings}
								style:margin-right="var(--space_sm)"
							>
								settings
							</button>
							<div class="reset">
								<button type="button" onclick={reset} disabled={!enable_reset}>
									reset
								</button>{#if load_time !== undefined}<div class="loaded_message" transition:slide>
										loaded in {Math.round(load_time)}ms
									</div>{/if}
							</div>
						</div>
					</div>
					{#if show_settings}
						<div transition:slide class="settings controls panel">
							<form class="width_100">
								<div class="mb_lg">
									<TootInput bind:url={updated_url} />
								</div>
								<fieldset class="row">
									<label
										class="row"
										title={autoload
											? 'replies will load automatically when scrolled intersect'
											: 'replies are not loaded until you request them'}
										><input type="checkbox" bind:checked={autoload} />automatically load when
										scrolled onscreen</label
									>
								</fieldset>
							</form>
							{@render settings?.()}
						</div>
					{/if}
				</div>
			</div>
		{/snippet}
	</TootLoader>
{/key}

<style>
	.toot {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		gap: var(--space_md);
		width: 100%;
	}
	.toot_content {
		flex: 1;
	}
	.toot_controls {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.controls {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space_md);
	}
	.icon_button_content {
		width: 100%;
		display: flex;
		align-items: center;
		text-align: left;
	}
	/* TODO messy */
	.icon_button_content .button_content {
		overflow: hidden;
	}
	.button_content {
		line-height: var(--line_height_lg);
	}
	.main_post {
		padding: var(--space_md);
	}
	.toot.replies .main_post {
		margin-bottom: var(--space_md);
	}
	.bg_panel {
		background-color: var(--bg);
		padding: var(--space_xs);
	}
	.icon {
		font-size: var(--icon_size_md);
		padding: var(--space_sm) var(--space_md) var(--space_sm) 0;
	}
	.reset {
		display: flex;
		align-items: center;
	}
	/* TODO hacky */
	.reset :global(button) {
		margin-bottom: 0;
	}
	.loaded_message {
		margin-left: var(--space_sm);
	}
	.settings {
		display: flex;
		padding: var(--space_md);
		margin-top: var(--space_md);
		width: 100%;
	}
	.transition_wrapper {
		display: flex;
		flex-direction: column;
	}
</style>
