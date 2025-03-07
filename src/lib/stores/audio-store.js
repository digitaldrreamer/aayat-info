
import { writable, derived } from 'svelte/store';

export function createAudioStore() {
	// Create writable stores
	/** @type {HTMLAudioElement | null} */
	const audio = writable(null);
	const isPlaying = writable(false);
	const currentTime = writable(0);
	const duration = writable(0);
	const playbackRate = writable(1);
	const volume = writable(1);

	// Set up the audio element
	function setSource(src) {
		audio.update(currentAudio => {
			// Clean up old audio if it exists
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.removeEventListener('timeupdate', updateTime);
				currentAudio.removeEventListener('loadedmetadata', updateDuration);
				currentAudio.removeEventListener('ended', handleEnded);
			}

			// Create new audio element
			const newAudio = new Audio(src);

			// Set up event listeners
			newAudio.addEventListener('timeupdate', updateTime);
			newAudio.addEventListener('loadedmetadata', updateDuration);
			newAudio.addEventListener('ended', handleEnded);

			// Apply current state
			playbackRate.subscribe(rate => {
				newAudio.playbackRate = rate;
			});

			volume.subscribe(vol => {
				newAudio.volume = vol;
			});

			return newAudio;
		});
	}

	// Event handlers
	function updateTime(event) {
		const target = event.target;
		currentTime.set(target.currentTime);
	}

	function updateDuration(event) {
		const target = event.target;
		duration.set(target.duration);
	}

	function handleEnded() {
		isPlaying.set(false);
	}

	// Control functions
	function togglePlay() {
		audio.update(currentAudio => {
			if (!currentAudio) return null;

			isPlaying.update(playing => {
				if (playing) {
					currentAudio.pause();
				} else {
					currentAudio.play().catch(error => {
						console.error('Error playing audio:', error);
						isPlaying.set(false);
					});
				}
				return !playing;
			});

			return currentAudio;
		});
	}

	function seek(time) {
		audio.update(currentAudio => {
			if (currentAudio) {
				currentAudio.currentTime = Math.max(0, Math.min(time, currentAudio.duration));
				currentTime.set(currentAudio.currentTime);
			}
			return currentAudio;
		});
	}

	function skip(seconds) {
		audio.update(currentAudio => {
			if (currentAudio) {
				const newTime = currentAudio.currentTime + seconds;
				currentAudio.currentTime = Math.max(0, Math.min(newTime, currentAudio.duration));
				currentTime.set(currentAudio.currentTime);
			}
			return currentAudio;
		});
	}

	function setPlaybackRate(rate) {
		const clampedRate = Math.max(0.5, Math.min(2, rate));
		playbackRate.set(clampedRate);

		audio.update(currentAudio => {
			if (currentAudio) {
				currentAudio.playbackRate = clampedRate;
			}
			return currentAudio;
		});
	}

	function setVolume(vol) {
		const clampedVol = Math.max(0, Math.min(1, vol));
		volume.set(clampedVol);

		audio.update(currentAudio => {
			if (currentAudio) {
				currentAudio.volume = clampedVol;
			}
			return currentAudio;
		});
	}

	return {
		audio,
		isPlaying,
		currentTime,
		duration,
		playbackRate,
		volume,
		togglePlay,
		setSource,
		seek,
		skip,
		setPlaybackRate,
		setVolume
	};
}