const { createVoiceClone } = require("../services/elevenlabs/voice.service");

async function cloneVoiceHandler(req, res, next) {
    try {
        const { voiceName } = req.body;

        if (!voiceName || !req.file) {
            return res.status(400).json({ error: "Required voiceName and audio file" });
        }

        const voice = await createVoiceClone(req.file.path, req.file.mimetype, voiceName);

        res.json({ message: "Voice clone created", voice });
    } catch (error) {
        next(error);
    }
}

module.exports = { cloneVoiceHandler };
