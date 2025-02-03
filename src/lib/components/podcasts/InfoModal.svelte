<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { Button } from "$lib/components/ui/button/index";

	let { show = $bindable(false), onclose } = $props();


	function closeModal() {
		onclose()
	}
</script>

<Dialog.Root bind:open={show}>
	<Dialog.Content class="sm:max-w-[425px] lg:max-w-screen-lg overflow-y-scroll max-h-screen">
		<Dialog.Header>
			<Dialog.Title>About Mufti Menk</Dialog.Title>
		</Dialog.Header>
		<div class="space-y-4">
			<img src="https://artwork.muslimcentral.com/mufti-menk-150x150.jpg" alt="Mufti Menk" class="w-32 h-32 mx-auto rounded-full" />
			<p>
				Mufti Menk, (Doctor, Mufti, Ismail Menk) is a leading global Islamic scholar born and raised in Zimbabwe. He studied Shariah in Madinah and holds a Doctorate of Social Guidance from Aldersgate University.
			</p>
			<p>
				Mufti Menk's work has gained worldwide recognition and he has been named one of "The Top 500 Most Influential Muslims in the World" since 2010.
			</p>
			<p>
				He has millions of followers across his social media platforms. Mufti Menk's personable style and down to earth approach has made him one of the most sought after scholars in our time. He has endeared himself to people with his much loved lecture series, a Mufti Menk hallmark.
			</p>
			<p>
				He travels the world spreading a simple but profound message: "Do good, help others while preparing for the Hereafter".
			</p>
			<p>
				He is active in the international arena and is a strong proponent of peace and justice, speaking up against all forms of terrorism.
			</p>
			<div class="flex space-x-2">
				<Button variant="outline" class="w-full" as="a" href="https://podcasts.apple.com/us/podcast/mufti-menk/id592746186" target="_blank" rel="noopener noreferrer">
					Apple Podcasts
				</Button>
				<Button variant="outline" class="w-full" as="a" href="https://open.spotify.com/show/1uNZDEDS2w6M9rjcFQQaK5" target="_blank" rel="noopener noreferrer">
					Spotify
				</Button>
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={closeModal}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

