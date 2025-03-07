<script lang="ts">
	/** @type {{
    value: number,
    max: number,
    step?: number,
    onchange: (value: number) => void
  }} */
	export let value = 0;
	export let max = 100;
	export let step = 1;
	export let onchange;

	let sliderWidth = 0;
	let isDragging = false;
	let slider: HTMLDivElement;

	function updateValue(clientX: number) {
		if (!slider) return;

		const rect = slider.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		const newValue = Math.round((x / rect.width) * max / step) * step;
		const clampedValue = Math.max(0, Math.min(newValue, max));

		if (value !== clampedValue) {
			value = clampedValue;
			onchange(value);
		}
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		updateValue(event.clientX);
		event.preventDefault(); // Prevent text selection
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			updateValue(event.clientX);
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleTouchStart(event: TouchEvent) {
		event.preventDefault()
		updateValue(event.touches[0].clientX);
		event.preventDefault(); // Prevent scrolling
	}

	function handleTouchMove(event: TouchEvent) {
		updateValue(event.touches[0].clientX);
		event.preventDefault(); // Prevent scrolling
	}
</script>

<svelte:window
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	ontouchmove|passive={false}
	ontouchend={handleMouseUp}
/>

<div
	class="relative w-full h-2 bg-gray-200 rounded-full cursor-pointer"
	bind:this={slider}
	bind:clientWidth={sliderWidth}
	onmousedown={handleMouseDown}
	ontouchstart={handleTouchStart}
>
	<div
		class="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
		style="width: {(value / max) * 100}%"
	></div>
	<div
		class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md transition-all duration-100 hover:scale-110"
		style="left: calc({(value / max) * 100}% - 0.5rem)"
	></div>
</div>