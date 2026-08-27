require("dotenv").config();

const config = {
    port: parseInt(process.env.PORT, 10),
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_KEY,
    elevenlabsVoiceId: process.env.ELEVENLABS_VOICE_ID,
    instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    igUserId: process.env.IG_USER_ID,
    heygenApiKey: process.env.HEYGEN_API_KEY,
    heygenFolderId: process.env.HEYGEN_FOLDER_ID,
};

function validateEnv() {
    const missing = [];
    if (!config.port) missing.push("PORT");
    if (!config.heygenApiKey) missing.push("HEYGEN_API_KEY");
    if (!config.elevenlabsApiKey) missing.push("ELEVENLABS_API_KEY");
    if (!config.elevenlabsVoiceId) missing.push("ELEVENLABS_VOICE_ID");
    if (missing.length > 0) {
        throw new Error(`Missing required env vars: ${missing.join(", ")}`);
    }
}

module.exports = { config, validateEnv };
