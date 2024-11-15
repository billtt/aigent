const OpenAI = require('openai');
const tiktoken = require("@dqbd/tiktoken");
const config = require('config');
const utils = require('./utils');

let _openai = null;
let _encoder = null;

async function queryOpenAI(messages) {
    const response = await _openai.chat.completions.create({
        model: config.get('openAI.model'),
        messages: messages,
        max_tokens: config.get('openAI.maxCompletionTokens')
    });

    const usage = response.usage;
    let price = usage.prompt_tokens * config.get('openAI.inputPrice') / 1000
        + usage.completion_tokens * config.get('openAI.outputPrice') / 1000;
    utils.logDebug(`Usage: ${JSON.stringify(usage)} Price: $${price.toFixed(2)}`);

    if (response.choices && response.choices.length > 0) {
        let reply = response.choices[0].message.content;
        return reply;
    }
}

async function queryOpenAISingle(query) {
    const message = {role: 'user', content: [{type: 'text', text: query}]};
    return await queryOpenAI([message]);
}

function countTokens(message) {
    if (typeof (message.content) === 'string') {
        return _encoder.encode(message.content).length;
    }
    let count = 0;
    for (let i= 0; i < message.content.length; i++) {
        const content = message.content[i];
        if (content.type === 'text') {
            count += _encoder.encode(content.text).length;
        } else if (content.type === 'image_url') {
            // assuming images are no larger than 512x512, need to adjust if otherwise
            count += 255;
        }
    }
    return count;
}

function init() {
    _openai = new OpenAI({ apiKey: config.get('openAI.apiKey') });
    _encoder = tiktoken.get_encoding("cl100k_base");
}

module.exports = { queryOpenAISingle, init };