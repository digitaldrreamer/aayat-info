// src/routes/api/upload/+server.js
import logger from '$lib/logger.js';
import { json } from "@sveltejs/kit";
import { url } from '$lib/url.js'

export async function POST({ request, fetch }) {
	try {
		logger.start('Processing initial file upload');

		const formData = await request.formData();
		logger.debug('Form data received', formData);

		// Get the 'audio' file from the FormData
		const audioFile = formData.get('audio');
		if (!audioFile) {
			logger.error('No audio file provided', { status: 400 });
			return json({
				status: 400,
				body: { error: 'No audio file provided' },
			});
		}

		logger.info('Audio file found, forwarding to processing endpoint');

		// Create a new FormData object to send to the processing endpoint
		const processingFormData = new FormData();
		processingFormData.append('audio', audioFile);

		// Call the processing endpoint
		const response = await fetch(`${url}/api/v1/ai`, {
			method: 'POST',
			body: processingFormData
		});

		const result = await response.json();
		logger.success('Processing completed', result);

		return json(result);
	} catch (error) {
		logger.error('Error in upload endpoint', error);
		return json({
			status: 500,
			body: { error: 'Error processing file' }
		});
	} finally {
		logger.end('Upload process completed');
	}
}