import {strip_end} from '@fuzdev/fuz_util/string.js';
import {type FetchValueCache, fetch_value} from '@fuzdev/fuz_util/fetch.js';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import {DEV} from 'esm-env';
import {UnreachableError} from '@fuzdev/fuz_util/error.js';
import {to_array} from '@fuzdev/fuz_util/array.js';

// TODO go through a single fetch helper and trace each call to the API,
// so we can see the history in a tab displayed to any users who want to dig

// TODO these names need help
// https://${host}/users/${author}/statuses/${id} // uri
// https://${host}/@${author}/${id} // url
// https://${host}/api/v1/statuses/${id} // status endpoint
// https://${host}/api/v1/statuses/${id}/context // status context endpoint
// https://${host}/api/v1/statuses/${id}/favourited_by // status favourited by endpoint

export const to_mastodon_status_url = (host: string, id: string): string =>
	`https://${host}/statuses/${id}`;

export const to_mastodon_status_url_with_author = (
	host: string,
	id: string,
	author: string,
): string => `https://${host}/@${author}/${id}`;

/**
 * longhand for `to_mastodon_status_url_with_author`, apperas
 */
export const to_mastodon_status_url_with_users_author = (
	host: string,
	id: string,
	author: string,
): string => `https://${host}/users/${author}/statuses/${id}`;

export const to_mastodon_api_status_url = (host: string, id: string): string =>
	`https://${host}/api/v1/statuses/${id}`;

export const to_mastodon_api_status_context_url = (host: string, id: string): string =>
	`https://${host}/api/v1/statuses/${id}/context`;

export const to_mastodon_api_favourites_url = (host: string, id: string): string =>
	`https://${host}/api/v1/statuses/${id}/favourited_by`;

// TODO should this have a `Parsed` prefix and then have a zod schema for the URL with a refinement type that uses `parse_mastodon_status_url`?
export interface MastodonStatusUrl {
	href: string;
	host: string;
	status_id: string;
	author?: string;
}

/**
 * parses a url to a post or API endpoint for a post, aka Mastodon status context
 * @param url
 * @returns the parsed host and id params, if any
 */
export const parse_mastodon_status_url = (url: string): MastodonStatusUrl | null => {
	try {
		const u = new URL(url);
		const parts = strip_end(u.pathname, '/context').split('/').filter(Boolean);
		const author = parts[0]?.[0] === '@' ? parts[0].substring(1) : null;
		if (!author) return null;
		const id = parts.length > 1 ? parts[parts.length - 1] : null;
		if (!id) return null;
		return {href: url, host: u.host, author, status_id: id};
	} catch (_err) {
		return null;
	}
};

export const fetch_mastodon_status_context = async (
	host: string,
	id: string,
	cache?: FetchValueCache | null,
	log?: Logger,
	request?: RequestInit,
	token?: string,
	fetch?: typeof globalThis.fetch,
): Promise<MastodonStatusContext | null> => {
	const url = to_mastodon_api_status_context_url(host, id);
	const fetched = await fetch_value(url, {
		request,
		token,
		cache,
		return_early_from_cache: DEV,
		log,
		fetch,
	});
	if (!fetched.ok) return null;
	return fetched.value;
};

export const fetch_mastodon_status = async (
	host: string,
	id: string,
	cache?: FetchValueCache | null,
	log?: Logger,
	request?: RequestInit,
	token?: string,
	fetch?: typeof globalThis.fetch,
): Promise<MastodonStatus | null> => {
	const url = to_mastodon_api_status_url(host, id);
	const fetched = await fetch_value(url, {
		request,
		token,
		cache,
		return_early_from_cache: DEV,
		log,
		fetch,
	});
	if (!fetched.ok) return null;
	return fetched.value;
};

export const fetch_mastodon_favourites = async (
	host: string,
	status_id: string,
	cache?: FetchValueCache | null,
	log?: Logger,
	request?: RequestInit,
	token?: string,
	fetch?: typeof globalThis.fetch,
): Promise<Array<MastodonFavourite> | null> => {
	const url = to_mastodon_api_favourites_url(host, status_id);
	const fetched = await fetch_value(url, {
		request,
		token,
		cache,
		return_early_from_cache: DEV,
		log,
		fetch,
	});
	if (!fetched.ok) return null;
	return fetched.value;
};

// TODO these are very in-progress - add schemas and use them for parsing in the fetch helpers (probably with `.passthrough()` for foward-compat?)

/**
 * result from `https://:host/api/v1/statuses/:id/context`
 * @see https://docs.joinmastodon.org/entities/Context/
 */
export interface MastodonStatusContext {
	ancestors: Array<MastodonStatus>;
	descendants: Array<MastodonStatus>;
}

export interface MastodonStatus {
	id: string;
	created_at: string;
	in_reply_to_id: string;
	in_reply_to_account_id: string;
	sensitive: boolean;
	spoiler_text: string;
	visibility: string;
	language: string;
	uri: string;
	url: string;
	replies_count: number;
	reblogs_count: number;
	favourites_count: number;
	edited_at: null | string;
	favourited: boolean;
	reblogged: boolean;
	muted: boolean;
	bookmarked: boolean;
	content: string;
	filtered: Array<unknown>;
	reblog: unknown; // | null;
	account: {
		id: string;
		username: string;
		acct: string;
		display_name: string;
		locked: boolean;
		bot: boolean;
		discoverable: boolean;
		group: boolean;
		created_at: string;
		note: string;
		url: string;
		avatar: string;
		avatar_static: string;
		header: string;
		header_static: string;
		followers_count: number;
		following_count: number;
		statuses_count: number;
		last_status_at: string;
		emojis: Array<unknown>;
		fields: Array<unknown>;
	};
	media_attachments: Array<unknown>;
	mentions: [
		{
			id: string;
			username: string;
			url: string;
			acct: string;
		},
	];
	tags: [
		{
			name: string;
			url: string;
		},
	];
	emojis: Array<unknown>;
	card: unknown; // | null;
	poll: unknown; // | null;
}

export interface MastodonFavourite {
	id: string;
	username: string;
	acct: string;
	display_name: string;
	locked: boolean;
	bot: boolean;
	discoverable: boolean;
	group: boolean;
	created_at: string; // Datetime
	note: string;
	url: string;
	avatar: string;
	avatar_static: string;
	header: string;
	header_static: string;
	followers_count: number;
	following_count: number;
	statuses_count: number;
	last_status_at: string;
	emojis: Array<unknown>;
	fields: Array<{
		name: string;
		value: string;
		verified_at: string; // Datetime
	}>;
}

/**
 * When filtering replies, at least one rule must pass for a reply to be included.
 */
export type ReplyFilter =
	| FavouritedByReplyFilter
	| MinimumFavouritesReplyFilter
	| CustomReplyFilter;

export interface FavouritedByReplyFilter {
	type: 'favourited_by';
	favourited_by: Array<string>;
}

export interface MinimumFavouritesReplyFilter {
	type: 'minimum_favourites';
	minimum_favourites: number;
}

export interface CustomReplyFilter {
	type: 'custom';
	should_include: (
		status: MastodonStatus,
		root_status: MastodonStatus,
		status_context: MastodonStatusContext,
	) => boolean;
}

export type CreateReplyFilters = (
	item: MastodonStatus,
	status_context: MastodonStatusContext,
) => ReplyFilter | Array<ReplyFilter> | null;

// TODO somehow figure out which toots should be included but aren't, and put them at the top level with some indicator the parent isn't there, or insert a fake parent?
// TODO refactor - maybe the name is misleading because it fetches?
export const filter_valid_replies = async (
	root_status: MastodonStatus,
	status_context: MastodonStatusContext,
	reply_filter: ReplyFilter | Array<ReplyFilter> | null,
	cache: FetchValueCache | null | undefined,
	log: Logger | undefined,
): Promise<Array<MastodonStatus>> => {
	const filters = reply_filter ? to_array(reply_filter) : null;
	const statuses = status_context.descendants;
	// For a reply to be included, there must be at least one rule that passes.
	if (!statuses.length || !filters?.length) {
		return [];
	}
	const host = new URL(root_status.url).host;
	const allowed = new Set(); // TODO could simplify if no longer used, was allowing author but changed to favourites - `statuses.filter((s) => s.account.acct === acct`
	// TODO do in parallel but with max concurrency, need a helper
	for (const status of statuses) {
		for (const filter of filters) {
			if (filter.type === 'favourited_by') {
				if (!status.favourites_count) {
					continue;
				}
				// TODO cache these somewhere maybe?
				const favourites = await fetch_mastodon_favourites(host, status.id, cache, log); // eslint-disable-line no-await-in-loop
				const favourite = favourites?.find((f) => filter.favourited_by.includes(f.acct)); // TODO customize via a prop (string/set/callback)
				// TODO this logic is what I want, but `favourite.created_at` is the account creation not the favourite creation, and the API doesn't appear to support it :[
				// if (favourite && (!s.edited_at || new Date(s.edited_at) < new Date(favourite.created_at))) {
				if (favourite) {
					allowed.add(status.id);
					break;
				}
			} else if (filter.type === 'minimum_favourites') {
				if (status.favourites_count >= filter.minimum_favourites) {
					allowed.add(status.id);
					break;
				}
				// TODO revisit whether this rule should be globally disabled,
				//or maybe change to a switch? problem is nesting, verbosity,
				// and need a for loop label because it would change the semantics of our `break` usage
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			} else if (filter.type === 'custom') {
				if (filter.should_include(status, root_status, status_context)) {
					allowed.add(status.id);
					break;
				}
			} else {
				throw new UnreachableError(filter);
			}
		}
	}
	return statuses.filter((s) => (allowed.has(s.id) ? s : null));
};
