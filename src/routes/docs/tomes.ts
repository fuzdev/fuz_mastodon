import type {Tome} from '@fuzdev/fuz_ui/tome.js';

import ApiPage from '$routes/docs/api/+page.svelte';
import PackagePage from '$routes/docs/package/+page.svelte';

export const tomes: Array<Tome> = [
	{
		slug: 'api',
		category: 'reference',
		Component: ApiPage,
		related_tomes: [],
		related_modules: [],
		related_declarations: [],
	},
	{
		slug: 'package',
		category: 'reference',
		Component: PackagePage,
		related_tomes: [],
		related_modules: [],
		related_declarations: [],
	},
];
