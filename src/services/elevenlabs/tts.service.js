const path = require("path");
const { getClient } = require("./client");
const { saveStreamToFile } = require("../../utils/audio");

const OUTPUT_DIR = path.join(__dirname, "..", "..", "..", "tmp", "audio");

async function textToSpeech(text, voiceId) {
    const audioStream = await getClient().textToSpeech.convert(voiceId, {
        output_format: "mp3_44100_128",
        text,
        model_id: "eleven_multilingual_v2",
    });

    const filename = path.join(
        OUTPUT_DIR,
        `tts-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp3`
    );

    return saveStreamToFile(audioStream, filename);
}

module.exports = { textToSpeech };
