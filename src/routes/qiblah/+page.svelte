<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";

	/** @type {HTMLElement} Reference to the compass circle element */
	let compassCircle;
	/** @type {HTMLElement} Reference to the my-point element */
	let myPoint;
	/** @type {HTMLElement} Reference to the qibla indicator element */
	let qiblaIndicator;

	// State variables
	let compass = $state(0);
	let pointDegree = $state(null);
	let hasPermission = $state(false);
	let hasLocation = $state(false);
	let isAligned = $state(false);
	let statusMessage = $state("Waiting to start...");
	let needsCalibration = $state(false);
	let accuracy = $state(0);
	let recentReadings = $state([]);
	let userPosition = $state(null);
	let showSensorAlert = $state(false);
	let sensorErrorMessage = $state("");

	// Constants
	/** @type {Object} Kaaba coordinates */
	const KAABA = {
		lat: 21.422487,
		lng: 39.826206
	};

	/** @type {number} Threshold in degrees for considering alignment with Qibla */
	const ALIGNMENT_THRESHOLD = 15;

	/** @type {boolean} Flag to detect iOS devices - initialized during onMount */
	let isIOS = $state(false);

	/**
	 * Calculate degrees from current position to Kaaba
	 * @param {number} latitude - Current latitude
	 * @param {number} longitude - Current longitude
	 * @returns {number} Bearing in degrees
	 */
	function calcDegreeToPoint(latitude, longitude) {
		const phiK = (KAABA.lat * Math.PI) / 180.0;
		const lambdaK = (KAABA.lng * Math.PI) / 180.0;
		const phi = (latitude * Math.PI) / 180.0;
		const lambda = (longitude * Math.PI) / 180.0;
		const psi =
			(180.0 / Math.PI) *
			Math.atan2(
				Math.sin(lambdaK - lambda),
				Math.cos(phi) * Math.tan(phiK) -
				Math.sin(phi) * Math.cos(lambdaK - lambda)
			);
		return Math.round(psi);
	}

	/**
	 * Handle geolocation position update
	 * @param {GeolocationPosition} position - Position object
	 */
	async function locationHandler(position) {
		const { latitude, longitude } = position.coords;
		userPosition = { latitude, longitude };

		// Calculate Qibla direction using our formula
		let calculatedDirection = calcDegreeToPoint(latitude, longitude);
		if (calculatedDirection < 0) {
			calculatedDirection = calculatedDirection + 360;
		}

		// Try to fetch and compare with API data
		try {
			const response = await fetch(
				`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
			);

			if (response.ok) {
				const data = await response.json();
				// Compare our calculation with the API value
				const apiDirection = data.data.direction;
				console.log("Calculated Qibla:", calculatedDirection, "API Qibla:", apiDirection);

				// Use API direction if significantly different
				if (Math.abs(apiDirection - calculatedDirection) > 5) {
					pointDegree = apiDirection;
				} else {
					pointDegree = calculatedDirection;
				}
			} else {
				pointDegree = calculatedDirection;
			}
		} catch (error) {
			console.error("Error fetching Qibla API data:", error);
			pointDegree = calculatedDirection;
		}

		hasLocation = true;
		statusMessage = "Qibla direction found. The needle points to Qibla.";
	}

	/**
	 * Handle errors from geolocation
	 * @param {GeolocationPositionError} error - Error object
	 */
	function locationErrorHandler(error) {
		console.error("Geolocation error:", error);
		sensorErrorMessage = "Location services are not available or permission was denied.";
		showSensorAlert = true;
		statusMessage = "Error getting location. Please check your permissions and try again.";
	}

	/**
	 * Handle device orientation events
	 * @param {DeviceOrientationEvent} event - Orientation event
	 */
	function orientationHandler(event) {
		// Get compass heading based on device and platform
		let newCompass;

		if (event.webkitCompassHeading) {
			// iOS webkit
			newCompass = event.webkitCompassHeading;
			accuracy = event.webkitCompassAccuracy;
		} else if (event.alpha !== null) {
			// Android/other
			newCompass = Math.abs(event.alpha - 360);
		} else {
			return; // No usable data
		}

		// Update compass value
		compass = newCompass;

		// Track readings for stability detection
		recentReadings.push(newCompass);
		if (recentReadings.length > 10) {
			recentReadings.shift();
		}

		// Update compass circle rotation - now we rotate the compass to show true north
		if (compassCircle) {
			compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
		}

		// Check if pointed at Qibla within threshold
		if (pointDegree !== null) {
			// Calculate difference between current heading and Qibla direction
			let diff = Math.abs(compass - pointDegree);
			// Normalize to 0-180 degrees (shortest path)
			if (diff > 180) diff = 360 - diff;

			// Check if within threshold
			isAligned = diff <= ALIGNMENT_THRESHOLD;

			// Update my-point visibility
			if (myPoint) {
				myPoint.style.opacity = isAligned ? 1 : 0;
			}
		}

		// Check sensor stability
		checkSensorStability();
	}

	/**
	 * Check stability of sensor readings
	 */
	function checkSensorStability() {
		if (recentReadings.length < 5) return;

		// Calculate standard deviation of recent readings
		const mean = recentReadings.reduce((sum, val) => sum + val, 0) / recentReadings.length;
		const variance = recentReadings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentReadings.length;
		const stdDev = Math.sqrt(variance);

		// Determine if calibration is needed based on deviation
		const previousNeedsCalibration = needsCalibration;
		needsCalibration = stdDev > 15;

		// Update status message if calibration status changed
		if (needsCalibration && !previousNeedsCalibration) {
			statusMessage = "Please calibrate by moving your device in a figure-8 pattern.";
		} else if (!needsCalibration && previousNeedsCalibration) {
			statusMessage = "Calibration complete. The needle points to Qibla.";
		}

		// Calculate accuracy percentage (inverted standard deviation)
		accuracy = Math.max(0, Math.min(100, 100 - (stdDev * 5)));
	}

	/**
	 * Check if device has required sensors
	 * @returns {boolean} True if sensors are available
	 */
	function checkSensorAvailability() {
		if (!browser) return false;

		// Check for geolocation
		if (!navigator || !navigator.geolocation) {
			sensorErrorMessage = "Geolocation is not supported by your device or browser.";
			return false;
		}

		// Check for device orientation
		if (!window || (
			!('DeviceOrientationEvent' in window) &&
			!('ondeviceorientation' in window) &&
			!('ondeviceorientationabsolute' in window)
		)) {
			sensorErrorMessage = "Orientation sensors are not available on your device.";
			return false;
		}

		return true;
	}

	/**
	 * Start the compass by requesting necessary permissions
	 */
	async function startCompass() {
		if (!browser) return; // Safety check

		// First check if sensors are available
		if (!checkSensorAvailability()) {
			showSensorAlert = true;
			return;
		}

		try {
			statusMessage = "Requesting permissions...";

			// Request geolocation permission
			if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					locationHandler,
					locationErrorHandler,
					{ enableHighAccuracy: true }
				);
			} else {
				sensorErrorMessage = "Geolocation not supported in your browser.";
				showSensorAlert = true;
				return;
			}

			// Request orientation permission (different on iOS)
			if (isIOS) {
				if (typeof DeviceOrientationEvent !== 'undefined' &&
					typeof DeviceOrientationEvent.requestPermission === 'function') {
					const response = await DeviceOrientationEvent.requestPermission();
					if (response === "granted") {
						window.addEventListener("deviceorientation", orientationHandler, true);
						hasPermission = true;
						statusMessage = "Sensor access granted. Getting location...";
					} else {
						sensorErrorMessage = "Sensor permission denied. Please allow motion and orientation access.";
						showSensorAlert = true;
					}
				} else {
					// Older iOS that doesn't require permission
					window.addEventListener("deviceorientation", orientationHandler, true);
					hasPermission = true;
					statusMessage = "Starting sensors. Getting location...";
				}
			} else {
				// Try to use absolute orientation on non-iOS devices
				if (window && 'ondeviceorientationabsolute' in window) {
					window.addEventListener("deviceorientationabsolute", orientationHandler, true);
				} else if (window) {
					window.addEventListener("deviceorientation", orientationHandler, true);
				} else {
					sensorErrorMessage = "Orientation sensors not available on your device.";
					showSensorAlert = true;
					return;
				}
				hasPermission = true;
				statusMessage = "Starting sensors. Getting location...";
			}
		} catch (error) {
			console.error("Error starting compass:", error);
			sensorErrorMessage = "Error starting compass. Your device may not support orientation sensors.";
			showSensorAlert = true;
		}
	}

	function closeAlert() {
		showSensorAlert = false;
	}

	onMount(() => {
		// Only run browser detection on client-side
		if (browser) {
			isIOS = navigator && navigator.userAgent &&
				navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
				navigator.userAgent.match(/AppleWebKit/);
		}
	});

	onDestroy(() => {
		// Clean up event listeners only if we're in a browser
		if (browser) {
			if (window) {
				if (isIOS) {
					window.removeEventListener("deviceorientation", orientationHandler, true);
				} else if ('ondeviceorientationabsolute' in window) {
					window.removeEventListener("deviceorientationabsolute", orientationHandler, true);
				} else {
					window.removeEventListener("deviceorientation", orientationHandler, true);
				}
			}
		}
	});
</script>

<div class="bg-neutral-50 min-h-screen py-8 px-4 sm:px-6">
	<div class="max-w-md mx-auto">
		<div class="bg-white rounded-xl shadow-lg overflow-hidden">
			<div class="p-6">
				<h2 class="text-2xl font-bold text-center mb-2">Qibla Direction Finder</h2>
				<p class="text-gray-600 text-center mb-6">
					Use your device's sensors to locate the direction to the Kaaba in Mecca
				</p>

				<div class="relative">
					{#if needsCalibration}
						<div class="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10 flex items-center bg-amber-50 text-amber-800 px-4 py-2 rounded-full shadow-md">
							<div class="animate-spin mr-2">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
								</svg>
							</div>
							<span class="text-sm font-medium">Calibration needed</span>
						</div>
					{/if}

					<div class="compass-container mx-auto relative" style="width: 280px; height: 280px;">
						<div class="absolute inset-0 rounded-full bg-white shadow-lg overflow-hidden">
							<!-- North indicator -->
							<div class="arrow absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10">
								<div class="w-0 h-0 border-x-[10px] border-x-transparent border-b-[20px] border-b-red-500"></div>
							</div>

							<!-- Compass face that rotates to show true north -->
							<div class="compass-circle absolute inset-[5%] rounded-full" bind:this={compassCircle}></div>

							<!-- Fixed Qibla needle that always points to Qibla -->
							<div class="qibla-needle absolute top-1/2 left-1/2 w-[4px] h-[120px] bg-green-600 -mt-[120px] -ml-[2px] z-20 origin-bottom"
									 bind:this={qiblaIndicator}>
								<div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
									Qibla Direction
								</div>
							</div>

							<!-- Alignment indicator -->
							<div class="my-point absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-500 rounded-full opacity-0 transition-opacity duration-500 z-10"
									 bind:this={myPoint}
									 class:animate-pulse={isAligned}></div>
						</div>
					</div>
				</div>

				{#if hasPermission}
					<div class="mt-6 space-y-2">
						<div class="flex justify-between text-sm">
							<span>Sensor accuracy</span>
							<span class={accuracy > 70 ? 'text-green-600' : accuracy > 40 ? 'text-amber-600' : 'text-red-600'}>
                {accuracy.toFixed(0)}%
              </span>
						</div>
						<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
							<div class="h-full transition-all duration-300 rounded-full"
									 class:bg-green-500={accuracy > 70}
									 class:bg-amber-500={accuracy > 40 && accuracy <= 70}
									 class:bg-red-500={accuracy <= 40}
									 style="width: {accuracy}%"></div>
						</div>
					</div>
				{/if}

				<div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-center">
					{statusMessage}
				</div>

				{#if !hasPermission}
					<button
						class="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						onclick={startCompass}
					>
						Start Compass
					</button>
				{/if}

				{#if hasLocation}
					<div class="mt-6 text-center">
						<p class="text-sm">
							<span class="text-gray-600">Qibla direction: </span>
							<span class="font-semibold">{pointDegree !== null ? pointDegree.toFixed(1) : '–'}°</span>
							{#if isAligned}
                <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Aligned
                </span>
							{/if}
						</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="mt-8 bg-white rounded-xl shadow-lg p-6">
			<h3 class="text-lg font-medium text-center mb-4">How to use:</h3>
			<ol class="space-y-4">
				<li class="flex items-start">
					<span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-medium mr-3 flex-shrink-0">1</span>
					<span>Click "Start Compass" and allow sensor permissions</span>
				</li>
				<li class="flex items-start">
					<span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-medium mr-3 flex-shrink-0">2</span>
					<span>Hold your device flat with the screen facing up</span>
				</li>
				<li class="flex items-start">
					<span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-medium mr-3 flex-shrink-0">3</span>
					<span>The green needle points to the Qibla direction</span>
				</li>
				<li class="flex items-start">
					<span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-medium mr-3 flex-shrink-0">4</span>
					<span>If prompted to calibrate, move your device in a figure-8 pattern</span>
				</li>
			</ol>
		</div>
	</div>
</div>

<AlertDialog.Root open={showSensorAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Sensor Not Available</AlertDialog.Title>
			<AlertDialog.Description>
				{sensorErrorMessage}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action asChild>
				<Button onclick={closeAlert}>Understand</Button>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<style>
    .compass-circle {
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><circle cx="200" cy="200" r="195" fill="white" stroke="%23333" stroke-width="2"/><path d="M200,10 L205,25 L195,25 Z" fill="%23E53935"/><text x="200" y="45" text-anchor="middle" font-size="20" fill="%23333">N</text><path d="M200,390 L205,375 L195,375 Z" fill="%23333"/><text x="200" y="365" text-anchor="middle" font-size="20" fill="%23333">S</text><path d="M10,200 L25,195 L25,205 Z" fill="%23333"/><text x="45" y="205" text-anchor="middle" font-size="20" fill="%23333">W</text><path d="M390,200 L375,195 L375,205 Z" fill="%23333"/><text x="355" y="205" text-anchor="middle" font-size="20" fill="%23333">E</text><circle cx="200" cy="200" r="5" fill="%23333"/><line x1="200" y1="15" x2="200" y2="30" stroke="%23333" stroke-width="2"/><line x1="200" y1="370" x2="200" y2="385" stroke="%23333" stroke-width="2"/><line x1="15" y1="200" x2="30" y2="200" stroke="%23333" stroke-width="2"/><line x1="370" y1="200" x2="385" y2="200" stroke="%23333" stroke-width="2"/><line x1="58" y1="58" x2="68" y2="68" stroke="%23333" stroke-width="1"/><line x1="58" y1="342" x2="68" y2="332" stroke="%23333" stroke-width="1"/><line x1="342" y1="58" x2="332" y2="68" stroke="%23333" stroke-width="1"/><line x1="342" y1="342" x2="332" y2="332" stroke="%23333" stroke-width="1"/><g stroke="%23ccc" stroke-width="1"><circle cx="200" cy="200" r="50"/><circle cx="200" cy="200" r="100"/><circle cx="200" cy="200" r="150"/></g></svg>') center no-repeat;
        background-size: contain;
        transition: transform 0.1s ease-out;
    }

    @keyframes pulse {
        0% {
            opacity: 0.7;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
            opacity: 0.9;
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
        }
        100% {
            opacity: 0.7;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
    }

    .animate-pulse {
        animation: pulse 2s infinite;
    }
</style>