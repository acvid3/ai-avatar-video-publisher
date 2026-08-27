const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const { config } = require("../../config/env");

function getClient() {
    return new ElevenLabsClient({ apiKey: config.elevenlabsApiKey });
}

module.exports = { getClient };
