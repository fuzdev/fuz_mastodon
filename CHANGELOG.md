# @fuzdev/fuz_mastodon

## 0.38.0

### Minor Changes

- upgrade deps ([#20](https://github.com/fuzdev/fuz_mastodon/pull/20))

## 0.37.0

### Minor Changes

- move to fuzdev ([1519dd5](https://github.com/fuzdev/fuz_mastodon/commit/1519dd5))

## 0.36.0

### Minor Changes

- upgrade peer deps ([e657c44](https://github.com/ryanatkn/fuz_mastodon/commit/e657c44))

## 0.35.0

### Minor Changes

- rename `PascalCase` from `Upper_Snake_Case` (lol) ([b377768](https://github.com/ryanatkn/fuz_mastodon/commit/b377768))

## 0.34.0

### Minor Changes

- upgrade peer deps ([#17](https://github.com/ryanatkn/fuz_mastodon/pull/17))

## 0.33.0

### Minor Changes

- update peer deps ([f23d872](https://github.com/ryanatkn/fuz_mastodon/commit/f23d872))

## 0.32.0

### Minor Changes

- upgrade @ryanatkn/moss@0.36 ([10e9655](https://github.com/ryanatkn/fuz_mastodon/commit/10e9655))

## 0.31.0

### Minor Changes

- bump node@22.15 from 22.11 ([4ce47ed](https://github.com/ryanatkn/fuz_mastodon/commit/4ce47ed))

## 0.30.0

### Minor Changes

- upgrade deps ([add36e6](https://github.com/ryanatkn/fuz_mastodon/commit/add36e6))

## 0.29.0

### Minor Changes

- bump node@22.11 ([#13](https://github.com/ryanatkn/fuz_mastodon/pull/13))

## 0.28.0

### Minor Changes

- upgrade peer dep to Svelte 5 ([24b0cf0](https://github.com/ryanatkn/fuz_mastodon/commit/24b0cf0))

## 0.27.1

### Patch Changes

- add a transition to the reply link ([ba0ae49](https://github.com/ryanatkn/fuz_mastodon/commit/ba0ae49))

## 0.27.0

### Minor Changes

- bump minor for context breaking changes ([cd41327](https://github.com/ryanatkn/fuz_mastodon/commit/cd41327))

## 0.26.1

### Patch Changes

- add a reply link ([a741c7f](https://github.com/ryanatkn/fuz_mastodon/commit/a741c7f))

## 0.26.0

### Minor Changes

- upgrade `date-fns@4` ([56f1e00](https://github.com/ryanatkn/fuz_mastodon/commit/56f1e00))

## 0.25.0

### Minor Changes

- bump required node version to `20.17` ([f43e387](https://github.com/ryanatkn/fuz_mastodon/commit/f43e387))

## 0.24.1

### Patch Changes

- update logo color to #8866cc from #6a40bf ([6073d1a](https://github.com/ryanatkn/fuz_mastodon/commit/6073d1a))

## 0.24.0

### Minor Changes

- upgrade deps ([b9b2dcd](https://github.com/ryanatkn/fuz_mastodon/commit/b9b2dcd))

## 0.23.1

### Patch Changes

- upgrade deps ([5d9c95d](https://github.com/ryanatkn/fuz_mastodon/commit/5d9c95d))

## 0.23.0

### Minor Changes

- rename some `Toot.svelte` props ([#12](https://github.com/ryanatkn/fuz_mastodon/pull/12))
  - rename `settings_storage_key` from `storage_key`
  - rename `autoload_storage_key` from `autoload_key`

### Patch Changes

- add `MastodonCache` helper in `mastodon_cache.svelte.ts` ([#12](https://github.com/ryanatkn/fuz_mastodon/pull/12))

## 0.22.0

### Minor Changes

- loosen peer deps temporarily ([82268ec](https://github.com/ryanatkn/fuz_mastodon/commit/82268ec))
- rename `reply_filter` from `reply_filters` and loosen type to accept single objects ([6e3ee47](https://github.com/ryanatkn/fuz_mastodon/commit/6e3ee47))

## 0.21.0

### Minor Changes

- upgrade `@ryanatkn/moss@0.9.0` from `0.8.0` and `@ryanatkn/fuz@0.116` from `0.115` ([04dd9df](https://github.com/ryanatkn/fuz_mastodon/commit/04dd9df))

## 0.20.0

### Minor Changes

- upgrade `@ryanatkn/fuz@0.115.0` from 0.112.0 ([492b269](https://github.com/ryanatkn/fuz_mastodon/commit/492b269))

## 0.19.0

### Minor Changes

- pin peer deps ([#11](https://github.com/ryanatkn/fuz_mastodon/pull/11))

### Patch Changes

- fix published types ([#11](https://github.com/ryanatkn/fuz_mastodon/pull/11))

## 0.18.0

### Minor Changes

- bump minor for breaking changes in fuz ([2e32942](https://github.com/ryanatkn/fuz_mastodon/commit/2e32942))

## 0.17.1

### Patch Changes

- upgrade `@ryanatkn/fuz@0.110.4` from `0.108.4` ([7661c64](https://github.com/ryanatkn/fuz_mastodon/commit/7661c64))

## 0.17.0

### Minor Changes

- change `reply_filters`, formerly `reply_filter_rules`, to make `null` apply no filters ([#10](https://github.com/ryanatkn/fuz_mastodon/pull/10))
- rename `reply_filters` from `reply_filter_rules` and `ReplyFilter` from `ReplyFilterRule` ([#10](https://github.com/ryanatkn/fuz_mastodon/commit/e967cd841b1e46772cb3bcac4b1ddc800a985154))

## 0.16.0

### Minor Changes

- rename `Toot` prop `url` from `initial_url` and `updated_url` from `url` ([#9](https://github.com/ryanatkn/fuz_mastodon/pull/9))
- rename `reply_filters` from `get_reply_filters` ([#9](https://github.com/ryanatkn/fuz_mastodon/pull/9))

## 0.15.0

### Minor Changes

- add rules to toot visibility ([#8](https://github.com/ryanatkn/fuz_mastodon/pull/8))
  - replies are now always included by default when `include_replies` is `true`
  - to get the old behavior, set `Toot` prop `get_reply_filters`
    to `(status) => [{type: 'favourited_by', favourited_by: [status.account.acct]}]`

## 0.14.2

### Patch Changes

- add tsconfig `sourceRoot` ([4477305](https://github.com/ryanatkn/fuz_mastodon/commit/4477305))
- enable tsconfig `declaration` and `declarationMap` ([161ad35](https://github.com/ryanatkn/fuz_mastodon/commit/161ad35))
- publish src files ([9c24f65](https://github.com/ryanatkn/fuz_mastodon/commit/9c24f65))

## 0.14.1

### Patch Changes

- add `sideEffects` to `package.json` ([b571ea1](https://github.com/ryanatkn/fuz_mastodon/commit/b571ea1))
- switch to `esm-env` from using `import.meta.env` ([#6](https://github.com/ryanatkn/fuz_mastodon/pull/6))

## 0.14.0

### Minor Changes

- add peer deps for Svelte and SvelteKit ([36738de](https://github.com/ryanatkn/fuz_mastodon/commit/36738de))

## 0.13.1

### Patch Changes

- upgrade gro with correctly formatted exports ([7006216](https://github.com/ryanatkn/fuz_mastodon/commit/7006216))

## 0.13.0

### Minor Changes

- support `node@20.12` and later ([ee77b51](https://github.com/ryanatkn/fuz_mastodon/commit/ee77b51))

## 0.12.0

### Minor Changes

- upgrade `node@22.3` ([#4](https://github.com/ryanatkn/fuz_mastodon/pull/4))

## 0.11.1

### Patch Changes

- work around Svelte 5 transition bug ([aa41d24](https://github.com/ryanatkn/fuz_mastodon/commit/aa41d24))

## 0.11.0

### Minor Changes

- upgrade to svelte 5 ([#3](https://github.com/ryanatkn/fuz_mastodon/pull/3))

## 0.10.0

### Minor Changes

- upgrade svelte-intersect@0.12.1 ([7a76383](https://github.com/ryanatkn/fuz_mastodon/commit/7a76383))

## 0.9.0

### Minor Changes

- upgrade @ryanatkn/fuz@0.91 ([36153b3](https://github.com/ryanatkn/fuz_mastodon/commit/36153b3))

## 0.8.0

### Minor Changes

- upgrade deps ([968210e](https://github.com/ryanatkn/fuz_mastodon/commit/968210e))

## 0.7.0

### Minor Changes

- republish ([1ee1ad2](https://github.com/ryanatkn/fuz_mastodon/commit/1ee1ad2))
- upgrade deps ([1ee1ad2](https://github.com/ryanatkn/fuz_mastodon/commit/1ee1ad2))

## 0.6.0

### Minor Changes

- upgrade deps ([bc34cb6](https://github.com/ryanatkn/fuz_mastodon/commit/bc34cb6))

## 0.5.0

### Minor Changes

- upgrade @grogarden/util to use `fetch_value` ([#2](https://github.com/ryanatkn/fuz_mastodon/pull/2))

## 0.4.1

### Patch Changes

- fix `MastodonStatusTree` ([40bc404](https://github.com/ryanatkn/fuz_mastodon/commit/40bc404))

## 0.4.0

### Minor Changes

- cleanup `MastodonStatusTree` API ([080d66e](https://github.com/ryanatkn/fuz_mastodon/commit/080d66e))

## 0.3.0

### Minor Changes

- unpublish package.ts ([e332cd8](https://github.com/ryanatkn/fuz_mastodon/commit/e332cd8))

## 0.2.4

### Patch Changes

- handle 429s ([7034797](https://github.com/ryanatkn/fuz_mastodon/commit/7034797))

## 0.2.3

### Patch Changes

- improve ratelimit handling ([e11b6fc](https://github.com/ryanatkn/fuz_mastodon/commit/e11b6fc))

## 0.2.2

### Patch Changes

- respect rate limits in `fetch_data` ([f8c1f65](https://github.com/ryanatkn/fuz_mastodon/commit/f8c1f65))

## 0.2.1

### Patch Changes

- fix a name ([b36c7c8](https://github.com/ryanatkn/fuz_mastodon/commit/b36c7c8))

## 0.2.0

### Minor Changes

- rename to `ProperSnakes` ([73447c0](https://github.com/ryanatkn/fuz_mastodon/commit/73447c0))

## 0.1.3

### Patch Changes

- upgrade `@grogarden/gro` to fix `package.ts` ([e7f5d95](https://github.com/ryanatkn/fuz_mastodon/commit/e7f5d95))

## 0.1.2

### Patch Changes

- use `import.meta.env.SSR` instead of `browser` from `$app/environment` ([6cab5ac](https://github.com/ryanatkn/fuz_mastodon/commit/6cab5ac))

## 0.1.1

### Patch Changes

- add peer deps ([48c518c](https://github.com/ryanatkn/fuz_mastodon/commit/48c518c))

## 0.1.0

### Minor Changes

- init ([0aa8e9c](https://github.com/ryanatkn/fuz_mastodon/commit/0aa8e9c))
