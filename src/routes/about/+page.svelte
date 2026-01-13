<script lang="ts">
	import LibraryDetail from '@fuzdev/fuz_ui/LibraryDetail.svelte';
	import {library_context} from '@fuzdev/fuz_ui/library.svelte.js';
	import Breadcrumb from '@fuzdev/fuz_ui/Breadcrumb.svelte';
	import EcosystemLinksPanel from '@fuzdev/fuz_ui/EcosystemLinksPanel.svelte';

	import PageFooter from '$routes/PageFooter.svelte';

	const library = library_context.get();
</script>

<main class="width_upto_md">
	<div class="box">
		<header>
			<h1 class="my_xl3">{library.repo_name}</h1>
		</header>
		<nav class="mb_xl3">
			<Breadcrumb>{library.package_json.glyph}</Breadcrumb>
		</nav>
	</div>
	<section class="box width:100% mb_lg">
		<div class="panel p_md width_upto_md">
			<LibraryDetail {library} />
		</div>
	</section>
	<EcosystemLinksPanel />
	<div class="box">
		<PageFooter {library} />
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}
	h1 {
		display: flex;
		align-items: baseline;
		text-align: center;
	}
</style>
