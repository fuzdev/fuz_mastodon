# fuz_mastodon

> Mastodon components for embedding toots with thread display and reply filtering

fuz_mastodon (`@fuzdev/fuz_mastodon`) is a Svelte component library for embedding
Mastodon posts in websites. It provides nested thread display, configurable reply
filtering, and optional caching for API responses.

For coding conventions, see [`fuz-stack`](../fuz-stack/CLAUDE.md).

## Gro commands

```bash
gro check     # typecheck, test, lint, format check (run before committing)
gro typecheck # typecheck only (faster iteration)
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

## Scope

fuz_mastodon is a **Mastodon embedding library**:

- Embed public Mastodon posts with thread display
- Reply filtering with multiple strategies (favourites, custom predicates)
- Offline development with response caching
- Reusable components for Svelte projects

### What fuz_mastodon does NOT include

- Authentication or account management
- Posting, replying, or boosting
- Direct messages or notifications
- Multiple account support
- Full Mastodon client features

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

**URL parsing:**

- `parse_mastodon_status_url(url)` - extract host/id/author from URL

**URL builders:**

- `to_mastodon_status_url(host, id)` - build web URL (basic)
- `to_mastodon_status_url_with_author(host, id, author)` - include author in path
- `to_mastodon_status_url_with_users_author(host, id, author)` - `/users/` path variant
- `to_mastodon_api_status_url(host, id)` - API endpoint for status
- `to_mastodon_api_status_context_url(host, id)` - API endpoint for context
- `to_mastodon_api_favourites_url(host, id)` - API endpoint for favourites

**Data fetching** (all accept optional cache, log, token):

- `fetch_mastodon_status(host, id, ...)` - fetch single toot
- `fetch_mastodon_status_context(host, id, ...)` - fetch ancestors + descendants
- `fetch_mastodon_favourites(host, id, ...)` - fetch accounts that favorited

**Reply filtering:**

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

- Uses `$state()` for reactive cache data
- `undefined` = still loading, `null` = no data
- Provided via `mastodon_cache_context`

**Dev cache format:** Create `mastodon_dev_cache_data.ts` exporting an array of
`[Url, FetchValueCacheItem]` tuples. Capture live API responses during online
development and store them for offline testing.

### Storage helpers (`storage.ts`)

- `load_from_storage(key, to_default, validate?)` - load with fallback and
  optional validation function
- `set_in_storage(key, value)` - store value (undefined removes, null stores)

### Context system

- `mastodon_cache_context` - provides `MastodonCache` for API response caching

### Svelte 5 patterns

- **Bindable outputs** - Components expose state via `$bindable()` (`loading`,
  `load_time`, `updated_url`, `item`, `status_context`, `replies`)
- **Snippet data passing** - TootLoader uses snippets to pass fetched data
- **Reactive cache** - MastodonCache uses `$state()` for reactive updates
- **Performance tracking** - `load_time` measures fetch duration

## Security

**CSP configuration:** Add Mastodon instance domains to your Content Security
Policy for image sources and API fetches.

**HTML content:** Uses `@html` to render user-generated content. Mastodon
servers sanitize content, but you should review CSP settings.

**CSS handling:** Special styles for Mastodon-specific classes (`.invisible`,
`.ellipsis`) to handle content formatting.

## Known limitations

- **Read-only public API** - no authentication or posting
- **Sequential favourite fetching** - filters fetch favourites one post at a
  time (TODO: add concurrency)
- **Svelte 5 animation quirks** - content transitions have known issues
- **Favourite timestamps unavailable** - API doesn't expose `favourite.created_at`,
  limiting time-based filtering options
- **Single layout** - more display variants planned

## Project standards

- TypeScript strict mode
- Svelte 5 with runes API ($state, $derived, $effect)
- Prettier with tabs, 100 char width
- Node >= 22.15
- Tests in `src/test/` (not co-located)
- Minimal test coverage (URL parsing only)

## Related projects

- [`fuz_css`](../fuz_css/CLAUDE.md) - CSS framework
- [`fuz_ui`](../fuz_ui/CLAUDE.md) - UI components and context helpers
- [`fuz_blog`](../fuz_blog/CLAUDE.md) - uses fuz_mastodon for blog comments
