---
'@fuzdev/fuz_mastodon': minor
---

fix: move `date-fns` from peer to `dependency` — it's pure functions with no singleton hazard, and consumers never interact with it
