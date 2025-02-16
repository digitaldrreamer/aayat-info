<script>
	import { onMount } from 'svelte';

	export let targetId = '';
	export let maxAttempts = 50;
	export let interval = 100;
	export let highlightDuration = 3000;
	export let highlightClasses = ['bg-yellow-200', 'underline', 'decoration-yellow-400'];

	let attempts = 0;
	let intervalId;

	function scrollToElement() {
		const element = document.getElementById(targetId);
		if (element) {
			setTimeout(() => {
				// Scroll into view
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});

				// Add highlight classes
				element.classList.add(...highlightClasses);

				// Remove highlight classes after duration
				setTimeout(() => {
					element.classList.remove(...highlightClasses);
				}, highlightDuration);
			}, 100);
			return true;
		}
		return false;
	}

	onMount(() => {
		if (!targetId) return;

		// Try scrolling immediately first
		if (scrollToElement()) return;

		// If immediate scroll fails, start polling
		intervalId = setInterval(() => {
			if (attempts >= maxAttempts) {
				clearInterval(intervalId);
				return;
			}

			if (scrollToElement()) {
				clearInterval(intervalId);
			}

			attempts++;
		}, interval);

		// Cleanup on component destroy
		return () => {
			if (intervalId) clearInterval(intervalId);

			// Clean up highlight if component is destroyed before animation finishes
			const element = document.getElementById(targetId);
			if (element) {
				element.classList.remove(...highlightClasses);
			}
		};
	});
</script>

<style>
    :global(.bg-yellow-200) {
        transition: background-color 0.3s ease-in-out;
    }
</style>