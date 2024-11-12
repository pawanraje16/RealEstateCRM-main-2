require('dotenv').config(); // Load environment variables from .env file
const cron = require('node-cron');
const fetch = require('node-fetch');

const job = () => {
    // Retrieve the URL from environment variable
    const urlToFetch = process.env.URL_TO_FETCH;

    if (!urlToFetch) {
        console.error('URL_TO_FETCH environment variable is not set!');
        process.exit(1); // Exit the process if the URL is not defined
    }

    // Schedule a task to run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            const response = await fetch(urlToFetch);

            // Handle the response
            if (response.ok) {
                console.log('Request successful:', response.status);
            } else {
                console.error('Request failed:', response.status);
            }
        } catch (error) {
            console.error('Error sending request:', error);
        }
    });

    console.log('Cron job running every 5 minutes...');
}
module.exports = job;