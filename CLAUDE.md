# fuz_mastodon

> Mastodon components for embedding toots with thread display and reply filtering

fuz_mastodon (`@fuzdev/fuz_mastodon`) is a Svelte component library for embedding
Mastodon posts in websites. It provides nested thread display, configurable reply
filtering, and optional caching for API responses.

For coding conventions, see [`fuz-stack`](../fuz-stack/CLAUDE.md).

## Gro commands

```bash
gro check     # typecheck, test, lint, format check (run before committing)
gro test      # run tests with vitest
gro gen       # regenerate .gen files
gro build     # build for production
```

IMPORTANT for AI agents: Do NOT run `gro dev` - the developer will manage the
dev server.

## Key dependencies

- Svelte 5 - component framework
- SvelteKit - application framework
- date-fns - date formatting for "ago" display
- esm-env - environment detection (DEV mode)
- fuz_css (@fuzdev/fuz_css) - CSS framework
- fuz_ui (@fuzdev/fuz_ui) - UI components, context helpers
- fuz_util (@fuzdev/fuz_util) - fetch utilities, logging, types

## Architecture

### Directory structure

```
src/
├── lib/                         # exportable library code
│   ├── mastodon.ts              # API types, fetch functions, reply filtering
│   ├── mastodon_cache.svelte.ts # MastodonCache class, mastodon_cache_context
│   ├── storage.ts               # localStorage helpers
│   ├── Toot.svelte              # main entry component
│   ├── TootLoader.svelte        # data fetching orchestrator
│   ├── TootInput.svelte         # URL input with validation
│   ├── MastodonStatusTree.svelte # recursive nested replies renderer
│   └── MastodonStatusItem.svelte # individual toot card display
├── test/                        # test files (not co-located)
│   └── mastodon.test.ts
└── routes/                      # demo/docs site
    ├── +page.svelte             # demo with filter examples
    ├── mastodon_dev_cache_data.ts # sample data for dev mode
    └── docs/                    # documentation pages
```

### Component hierarchy

```
Toot.svelte (main entry point)
└── TootLoader.svelte (data fetching)
    └── MastodonStatusTree.svelte (recursive renderer)
        └── MastodonStatusItem.svelte (individual toot)
```

### Core types (`mastodon.ts`)

**API response types:**

- `MastodonStatus` - a single toot with content, account, stats, reply info
- `MastodonStatusContext` - `{ ancestors, descendants }` for thread context
- `MastodonFavourite` - account that favorited a post
- `MastodonStatusUrl` - parsed URL with `host`, `status_id`, `author`

**Reply filter types:**

```typescript
type ReplyFilter =
  | { type: 'favourited_by'; favourited_by: string[] }
  | { type: 'minimum_favourites'; minimum_favourites: number }
  | { type: 'custom'; should_include: (status, root, context) => boolean };

type CreateReplyFilters = (item, context) => ReplyFilter | ReplyFilter[] | null;
```

Multiple filters use OR logic - at least one must pass for a reply to be included.

### Key functions (`mastodon.ts`)

URL utilities:

- `parse_mastodon_status_url(url)` - extract host/id/author from URL
- `to_mastodon_status_url(host, id)` - build web URL
- `to_mastodon_api_status_url(host, id)` - build API endpoint

Data fetching (all accept optional cache, log, token):

- `fetch_mastodon_status(host, id, ...)` - fetch single toot
- `fetch_mastodon_status_context(host, id, ...)` - fetch ancestors + descendants
- `fetch_mastodon_favourites(host, id, ...)` - fetch accounts that favorited

Reply filtering:

- `filter_valid_replies(root, context, filter, cache, log)` - async filter that
  fetches favourites data on demand for `favourited_by` filters

### Components

**Toot.svelte** - main entry point

Props:
- `url` - Mastodon post URL (required)
- `include_ancestors` - show posts before root
- `include_replies` - fetch and show replies
- `reply_filter` - filter function or array of filters
- `cache` - optional `FetchValueCache` for API responses
- `autoload` - auto-load when scrolled into view (stored in localStorage)
- `show_settings` - toggle settings panel (stored in localStorage)

Bindable outputs: `loading`, `load_time`, `updated_url`

**TootLoader.svelte** - data layer

- Fetches status and context in parallel with `Promise.all()`
- Applies reply filtering if `include_replies` is true
- Tracks load timing with `performance.now()`
- Exposes `item`, `status_context`, `replies` via snippet

**MastodonStatusTree.svelte** - recursive renderer

- Filters items by `in_reply_to_id`
- Recursively renders children with nested structure

**MastodonStatusItem.svelte** - toot display

- Avatar with click-to-toggle bio
- Account name, handle, follower count
- Created date with "ago" format, edit indicator
- HTML content with Mastodon-specific CSS handling
- Spoiler warnings as `<details>` elements
- Link to reply on original Mastodon server

**TootInput.svelte** - URL input

- Validates with `parse_mastodon_status_url()`
- Shows error alert for invalid URLs

### Caching system

**MastodonCache class** (`mastodon_cache.svelte.ts`):

```typescript
class MastodonCache {
  data: FetchValueCache | undefined | null = $state();

  constructor(
    load_data: () => Promise<[Url, FetchValueCacheItem][] | null>,
    load_on_mount = true
  );
}
```

- `undefined` = still loading
- `null` = no data
- Provided via `mastodon_cache_context`

Dev mode caching: Create `mastodon_dev_cache_data.ts` with pre-cached API
responses as `[Url, FetchValueCacheItem][]` tuples for offline testing.

### Context system

- `mastodon_cache_context` - provides `MastodonCache` for API response caching

### Storage helpers (`storage.ts`)

- `load_from_storage(key, default, validate?)` - load with fallback
- `set_in_storage(key, value)` - store value (undefined removes, null stores)

## Usage examples

Basic embedding:

```svelte
<script>
  import Toot from '@fuzdev/fuz_mastodon/Toot.svelte';
</script>

<Toot url="https://fosstodon.org/@user/123456789" />
```

With reply filtering by favorites:

```svelte
<Toot
  url="https://fosstodon.org/@user/123456789"
  include_replies
  reply_filter={(item) => ({
    type: 'favourited_by',
    favourited_by: [item.account.acct],
  })}
/>
```

With minimum favorites threshold:

```svelte
<Toot
  url="..."
  include_replies
  reply_filter={() => ({type: 'minimum_favourites', minimum_favourites: 3})}
/>
```

With custom filter:

```svelte
<Toot
  url="..."
  include_replies
  reply_filter={() => ({
    type: 'custom',
    should_include: (status) => status.account.followers_count > 100,
  })}
/>
```

## Limitations

- No authentication support (read-only public API)
- Single view/layout (more layouts planned)
- CSP configuration required for Mastodon domains

## Project standards

- TypeScript strict mode
- Svelte 5 with runes API ($state, $derived, $effect)
- Prettier with tabs, 100 char width
- Node >= 22.15
- Tests in `src/test/` (not co-located)

## Related projects

- [`fuz_css`](../fuz_css/CLAUDE.md) - CSS framework
- [`fuz_ui`](../fuz_ui/CLAUDE.md) - UI components and context helpers
- [`fuz_blog`](../fuz_blog/CLAUDE.md) - uses fuz_mastodon for blog comments
