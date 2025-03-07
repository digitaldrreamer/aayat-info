<script>
	import { onMount, onDestroy } from 'svelte';
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as Alert from "$lib/components/ui/alert";
	import { Progress } from "$lib/components/ui/progress";
	import { browser } from '$app/environment';

	/** @type {HTMLElement} Reference to the compass circle element */
	let compassCircle;
	/** @type {HTMLElement} Reference to the my-point element */
	let myPoint;

	// State variables
	/** @type {number} Current compass heading in degrees */
	let compass = $state(0);
	/** @type {number} Qibla direction in degrees from current position */
	let pointDegree = $state(null);
	/** @type {boolean} Flag to track if sensors have permission */
	let hasPermission = $state(false);
	/** @type {boolean} Flag to track if location has been acquired */
	let hasLocation = $state(false);
	/** @type {boolean} Flag to track if the device is aligned with Qibla */
	let isAligned = $state(false);
	/** @type {string} Status message to show user */
	let statusMessage = $state("Waiting to start...");
	/** @type {boolean} Flag to indicate if sensor calibration is needed */
	let needsCalibration = $state(false);
	/** @type {number} Accuracy of the compass (0-100) */
	let accuracy = $state(0);
	/** @type {Array} Recent compass readings to detect stability */
	let recentReadings = $state([]);
	/** @type {Object} User's current position coordinates */
	let userPosition = $state(null);

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
		statusMessage = "Location acquired. Point your device toward Qibla.";
	}

	/**
	 * Handle errors from geolocation
	 * @param {GeolocationPositionError} error - Error object
	 */
	function locationErrorHandler(error) {
		console.error("Geolocation error:", error);
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

		// Update compass circle rotation
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
			statusMessage = "Calibration complete. Point your device toward Qibla.";
		}

		// Calculate accuracy percentage (inverted standard deviation)
		accuracy = Math.max(0, Math.min(100, 100 - (stdDev * 5)));
	}

	/**
	 * Start the compass by requesting necessary permissions
	 */
	async function startCompass() {
		if (!browser) return; // Safety check

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
				statusMessage = "Geolocation not supported in your browser.";
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
						statusMessage = "Sensor permission denied. Please allow motion and orientation access.";
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
				}
				hasPermission = true;
				statusMessage = "Starting sensors. Getting location...";
			}
		} catch (error) {
			console.error("Error starting compass:", error);
			statusMessage = "Error starting compass. Your device may not support orientation sensors.";
		}
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

<div class="container">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Qibla Direction Finder</Card.Title>
			<Card.Description>
				Use your device's sensors to locate the direction to the Kaaba in Mecca
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="compass-wrapper">
				<div class="compass">
					<div class="arrow"></div>
					<div class="compass-circle" bind:this={compassCircle}></div>
					<div
						class="qibla-direction"
						style="transform: rotate({pointDegree}deg)"
					></div>
					<div
						class="my-point"
						bind:this={myPoint}
						class:pulsing={isAligned}
					></div>
				</div>

				<div class="calibration-indicator" class:show={needsCalibration}>
					<div class="calibration-icon"></div>
					<span>Calibration needed</span>
				</div>
			</div>

			{#if hasPermission}
				<div class="mt-4 space-y-2">
					<div class="flex justify-between text-sm">
						<span>Sensor accuracy</span>
						<span>{Math.round(accuracy)}%</span>
					</div>
					<Progress value={accuracy} />
				</div>
			{/if}

			<Alert.Root class="mt-4">
				<Alert.Description>{statusMessage}</Alert.Description>
			</Alert.Root>

			{#if !hasPermission && browser}
				<Button class="w-full mt-4" on:click={startCompass}>
					Start Compass
				</Button>
			{/if}

			{#if hasLocation}
				<div class="mt-4 text-center">
					<p class="text-sm text-muted-foreground">
						Qibla direction: {pointDegree ? Math.round(pointDegree) : '–'}°
						{#if isAligned}
							<span class="text-green-600 font-bold">✓ Aligned</span>
						{/if}
					</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	<div class="mt-8 max-w-md text-center">
		<h3 class="text-lg font-medium mb-2">How to use:</h3>
		<ol class="text-sm text-left space-y-2">
			<li>1. Click "Start Compass" and allow sensor permissions</li>
			<li>2. Hold your device flat with the screen facing up</li>
			<li>3. Turn slowly until you see the green indicator light up</li>
			<li>4. If prompted to calibrate, move your device in a figure-8 pattern</li>
		</ol>
	</div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
        background-color: #f8f9fa;
    }

    .compass-wrapper {
        position: relative;
        width: 320px;
        height: 320px;
        margin: 2rem auto;
    }

    .compass {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        background-color: white;
    }

    .compass > .arrow {
        position: absolute;
        width: 0;
        height: 0;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        border-style: solid;
        border-width: 30px 20px 0 20px;
        border-color: red transparent transparent transparent;
        z-index: 1;
    }

    .compass > .compass-circle {
        position: absolute;
        width: 90%;
        height: 90%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease-out;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><circle cx="200" cy="200" r="195" fill="white" stroke="%23333" stroke-width="2"/><path d="M200,10 L205,25 L195,25 Z" fill="%23E53935"/><text x="200" y="45" text-anchor="middle" font-size="20" fill="%23333">N</text><path d="M200,390 L205,375 L195,375 Z" fill="%23333"/><text x="200" y="365" text-anchor="middle" font-size="20" fill="%23333">S</text><path d="M10,200 L25,195 L25,205 Z" fill="%23333"/><text x="45" y="205" text-anchor="middle" font-size="20" fill="%23333">W</text><path d="M390,200 L375,195 L375,205 Z" fill="%23333"/><text x="355" y="205" text-anchor="middle" font-size="20" fill="%23333">E</text><circle cx="200" cy="200" r="5" fill="%23333"/><line x1="200" y1="15" x2="200" y2="30" stroke="%23333" stroke-width="2"/><line x1="200" y1="370" x2="200" y2="385" stroke="%23333" stroke-width="2"/><line x1="15" y1="200" x2="30" y2="200" stroke="%23333" stroke-width="2"/><line x1="370" y1="200" x2="385" y2="200" stroke="%23333" stroke-width="2"/><line x1="58" y1="58" x2="68" y2="68" stroke="%23333" stroke-width="1"/><line x1="58" y1="342" x2="68" y2="332" stroke="%23333" stroke-width="1"/><line x1="342" y1="58" x2="332" y2="68" stroke="%23333" stroke-width="1"/><line x1="342" y1="342" x2="332" y2="332" stroke="%23333" stroke-width="1"/><g stroke="%23ccc" stroke-width="1"><circle cx="200" cy="200" r="50"/><circle cx="200" cy="200" r="100"/><circle cx="200" cy="200" r="150"/></g></svg>') center no-repeat;
        background-size: contain;
    }

    .compass > .my-point {
        position: absolute;
        width: 20%;
        height: 20%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(8, 223, 69, 0.5);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.5s ease-out;
        z-index: 2;
        box-shadow: 0 0 10px rgba(8, 223, 69, 0.7);
    }

    .compass > .qibla-direction {
        position: absolute;
        width: 0;
        height: 0;
        top: 50%;
        left: 50%;
        transform-origin: center;
        z-index: 1;
    }

    .qibla-direction::after {
        content: '';
        position: absolute;
        top: -140px;
        left: -8px;
        width: 16px;
        height: 140px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 140"><path d="M8,0 L16,140 L8,130 L0,140 Z" fill="none" stroke="%2343A047" stroke-width="2" stroke-dasharray="5,5"/></svg>') center no-repeat;
    }

    .calibration-indicator {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .calibration-indicator.show {
        opacity: 1;
    }

    .calibration-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M12,14L13.5,17H10.5L12,14Z" fill="%23FF9800"/></svg>') center no-repeat;
        animation: rotate 2s infinite linear;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes pulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
        }
    }

    .pulsing {
        animation: pulse 2s infinite ease-in-out;
    }
</style>