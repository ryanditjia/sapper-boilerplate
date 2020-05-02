<style>
	h1,
	figure,
	p {
		@apply mx-auto text-center;
	}

	h1 {
		@apply text-5xl;
		margin: 0 0 0.5em 0;

		@screen sm {
			@apply text-6xl;
		}
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1 class="uppercase font-bold">Great success!</h1>

<figure>
	<img alt="Borat" src="great-success.png" />
	<figcaption>HIGH FIVE!</figcaption>
</figure>

<p>
	<strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong>
</p>
