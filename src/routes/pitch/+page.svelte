<script>
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<iframe
	src="https://pitch.com/v/ai-aayahinfo-sfwe6p"
	title="Aayah Info"
>
	Your browser does not support iframes.
	<Button onclick={() => (window.open('https://pitch.com/v/ai-aayahinfo-sfwe6p', '_BLANK'))}>Go To Pitch Deck</Button>
</iframe>

<style>
    html, body {
        margin: 0;
        padding-top: 56px; /* Adjust this value if your header height changes */
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    iframe {
        position: absolute;
        top: 56px; /* Same as header height */
        left: 0;
        width: 100vw;
        height: calc(100vh - 56px); /* Ensures the iframe takes up the rest of the screen */
        border: none;
    }

</style>
