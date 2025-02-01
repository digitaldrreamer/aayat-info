const share = async ({ title, text, url }) => {
	// Prepare the data to be shared
	const shareData = { title, text, url };

	// Check if the browser supports sharing the provided data
	if (navigator.canShare && navigator.canShare(shareData)) {
		try {
			// Attempt to share the data
			await navigator.share(shareData);
			console.log('Content shared successfully!');
		} catch (error) {
			console.error('Error sharing content:', error);
		}
	} else {
		// Fallback: Notify the user that sharing isn't supported
		console.warn('Web share is not supported on this device or with this data.');
		// You can add additional fallback behavior here, like copying the URL to clipboard or showing a modal.
	}
};

export default share