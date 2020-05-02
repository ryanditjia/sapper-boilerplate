<script>
	import NProgress from 'nprogress'
	import Nav from '../components/Nav.svelte'
	import { stores } from '@sapper/app'

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false,
	})

	const { preloading } = stores()

	$: {
		if ($preloading) {
			NProgress.start()
		}

		if (!$preloading) {
			NProgress.done()
		}
	}

	export let segment
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment} />

<main>
	<slot />
</main>
