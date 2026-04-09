import type {FetchValueCache, FetchValueCacheItem} from '@fuzdev/fuz_util/fetch.js';
import type {Url} from '@fuzdev/fuz_util/url.js';
import {onMount} from 'svelte';
import {create_context} from '@fuzdev/fuz_ui/context_helpers.js';

export class MastodonCache {
	// TODO maybe add a loading status state?

	readonly load_data: () => Promise<Array<[Url, FetchValueCacheItem]> | null>;

	/**
	 * If `undefined`, it's still loading. `null` means no data.
	 */
	data: FetchValueCache | undefined | null = $state.raw();

	constructor(
		load_data: () => Promise<Array<[Url, FetchValueCacheItem]> | null>,
		load_on_mount = true,
	) {
		this.load_data = load_data;
		if (load_on_mount) {
			onMount(this.load);
		}
	}

	load = async (): Promise<void> => {
		const loaded = await this.load_data();
		this.data = loaded && new Map(loaded);
	};
}

export const mastodon_cache_context = create_context<MastodonCache>();
