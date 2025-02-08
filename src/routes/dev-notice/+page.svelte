<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Separator } from "$lib/components/ui/separator";
	import { AlertTriangle, Clock, Construction, Heart, Rocket, ThumbsUp } from "lucide-svelte";

	function navigateHome() {
		goto('/');
	}
</script>

<div class="min-h-screen bg-neutral-50 p-4 sm:p-8">
	<div class="max-w-3xl mx-auto space-y-8">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl sm:text-3xl font-bold text-center">A Personal Note from the Developer</Card.Title>
				<Card.Description class="text-center text-base sm:text-lg">
					Thank you for using our Quran and Islamic resources app!
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<p class="text-lg">
					Assalamu alaikum! I wanted to take a moment to share some thoughts about this app with you.
				</p>

				<section aria-labelledby="development-time">
					<h2 id="development-time" class="sr-only">Development Time</h2>
					<div class="flex items-start space-x-4">
						<Clock class="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
						<p>
							This project was built in a very short time frame - 9 hours 45 minutes for the backend and 22 hours 52 minutes for the frontend. While I'm proud of what has been accomplished, there's still a lot more I want to do.
						</p>
					</div>
				</section>

				<Separator />

				<section aria-labelledby="features-needing-work">
					<h2 id="features-needing-work" class="text-xl font-semibold flex items-center mb-2">
						<AlertTriangle class="h-6 w-6 text-yellow-500 mr-2" />
						Features That Need More Work
					</h2>
					<ul class="list-disc list-inside space-y-2 pl-4">
						<li>AI recitation recognition is not functioning correctly via API</li>
						<li>Live Murajah Tracker is currently unavailable due to AI issues</li>
						<li>ElevenLabs AI voice for TTS sounds unnatural with Arabic</li>
						<li>Tafsir is not standalone and has limited functionality</li>
						<li>Unable to change reciters, font, translation, and more at the moment</li>
					</ul>
				</section>

				<Separator />

				<section aria-labelledby="achievements-and-future-plans" class="space-y-4">
					<h2 id="achievements-and-future-plans" class="sr-only">Achievements and Future Plans</h2>
					<div class="flex items-start space-x-4">
						<Rocket class="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
						<p>
							Despite these challenges, I've created a source of truth - a quick way for you to check through Quranic verses and listen to reciters. It may not be everything we envisioned, but Alhamdulillah for what we have achieved.
						</p>
					</div>

					<div class="flex items-start space-x-4">
						<Heart class="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
						<p>
							Your understanding and patience mean the world to us. We're committed to improving and expanding this app to serve you better.
						</p>
					</div>

					<div class="flex items-start space-x-4">
						<Construction class="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
						<p>
							I hope to eventually work on enhancing features like AI recognition, improving the Murajah Tracker, and adding more customization options. Your feedback is invaluable in this process.
						</p>
					</div>
				</section>

				<p class="text-lg font-semibold text-center">
					Thank you for being part of this journey. Together, we'll make this app an even better resource for Islamic learning and reflection.
				</p>
			</Card.Content>
			<Card.Footer class="flex justify-center">
				<Button onclick={navigateHome} class="w-full sm:w-auto">
					<ThumbsUp class="mr-2 h-5 w-5" />
					Continue to App
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>
</div>