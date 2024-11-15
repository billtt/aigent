/**
 * An HTTP RESTful server that works as a simple proxy that queries OpenAI (ChatGPT).
 */

const config = require('config');
const openAIManager = require('./openAIManager');
const express = require('express');
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/openai/completion/single', async (req, res) => {
    // Get the message from the request body
    const query = req.body.query;
    const key = req.body.key;
    if (key === config.get('apiServer.key') && query) {
        // Send the message to OpenAI and return the response
        const response = await openAIManager.queryOpenAISingle(query);
	res.set('Content-Type', 'text/plain; charset=UTF-8');
        res.send(response);
    } else {
        res.send('');
    }
});

function init() {
    const PORT = config.get('apiServer.port');
    app.listen(PORT, () => {
        console.log(`API Server is running on port ${PORT}`);
    });
}

module.exports = { init };
