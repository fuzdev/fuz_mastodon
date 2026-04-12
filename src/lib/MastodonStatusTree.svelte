<script lang="ts">
	import type {MastodonStatus} from './mastodon.js';
	import Message from './MastodonStatusItem.svelte';
	import MastodonStatusTree from './MastodonStatusTree.svelte';

	const {
		item,
		items,
	}: {
		item: MastodonStatus;
		items: Array<MastodonStatus>;
	} = $props();

	const {id} = $derived(item);
	const replies = $derived(items.filter((i) => i.in_reply_to_id === id));
</script>

{#if replies.length}
	<ul class="mastodon-status-tree unstyled">
		{#each replies as reply (reply.id)}
			<li>
				<Message item={reply} />
				<MastodonStatusTree item={reply} {items} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	.mastodon-status-tree {
		padding-left: var(--space_xl4);
		margin-bottom: var(--space_md);
	}
	li {
		flex-direction: column;
	}
</style>
