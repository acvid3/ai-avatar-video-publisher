const { InstagramClient } = require("meta-lib");
const { config } = require("../config/env");

async function resolveIgUserId(accessToken) {
    const response = await fetch(
        `https://graph.instagram.com/v25.0/me?fields=id&access_token=${accessToken}`
    );
    const data = await response.json();
    if (!data.id) {
        throw new Error(`Failed to resolve Instagram user id: ${JSON.stringify(data)}`);
    }
    return data.id;
}

async function getClient() {
    if (!config.instagramAccessToken) {
        throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured");
    }

    const igUserId = config.igUserId || (await resolveIgUserId(config.instagramAccessToken));
    return new InstagramClient(config.instagramAccessToken, igUserId);
}

async function publishReels({ videoUrl, caption }) {
    const client = await getClient();
    return client.createReels([{ videoUrl }], { caption: caption || "" });
}

module.exports = { publishReels };
