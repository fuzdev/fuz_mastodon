<script lang="ts">
	import LibraryDetail from '@fuzdev/fuz_ui/LibraryDetail.svelte';
	import {Library, library_context} from '@fuzdev/fuz_ui/library.svelte.js';
	import Breadcrumb from '@fuzdev/fuz_ui/Breadcrumb.svelte';
	import EcosystemLinksPanel from '@fuzdev/fuz_ui/EcosystemLinksPanel.svelte';

	import PageFooter from '$routes/PageFooter.svelte';
	import {library_json} from '$routes/library.js';

	const library = new Library(library_json);
	library_context.set(() => library);
</script>

<main class="column align-items:center mx_auto width_atmost_md">
	<div class="box">
		<header>
			<h1 class="my_xl3 text-align:center">{library.repo_name}</h1>
		</header>
		<nav class="mb_xl3">
			<Breadcrumb />
		</nav>
	</div>
	<section class="box width:100% mb_lg">
		<div class="panel p_md width_atmost_md">
			<LibraryDetail {library} />
		</div>
	</section>
	<EcosystemLinksPanel />
	<div class="box">
		<PageFooter {library} />
	</div>
</main>
