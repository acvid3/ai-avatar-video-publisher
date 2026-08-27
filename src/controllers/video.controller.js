const { getProvider } = require("../services/providers");
const { config } = require("../config/env");

async function generateVideoHandler(req, res, next) {
    const { text, voiceId, avatarId, provider: providerName } = req.body;

    if (!text || !avatarId) {
        return res.status(400).json({ error: "Required text and avatarId" });
    }

    try {
        const provider = getProvider(providerName);
        const result = await provider.generateVideo({
            text,
            voiceId: voiceId || config.elevenlabsVoiceId,
            avatarId,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function videoStatusHandler(req, res, next) {
    const { videoId, provider: providerName } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: "Required videoId" });
    }

    try {
        const provider = getProvider(providerName);
        const result = await provider.videoStatus(videoId);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { generateVideoHandler, videoStatusHandler };
