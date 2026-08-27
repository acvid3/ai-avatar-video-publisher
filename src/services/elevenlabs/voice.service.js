const fs = require("fs");
const { getClient } = require("./client");
const { convertToMp3, splitAudio, removeFiles } = require("../../utils/audio");

const MIN_CHUNKS = 3;

async function createVoiceClone(originalPath, mimeType, voiceName) {
    let mp3Path = originalPath;
    let chunks = [];

    try {
        if (mimeType === "audio/ogg") {
            mp3Path = await convertToMp3(originalPath);
        }

        chunks = await splitAudio(mp3Path);

        if (chunks.length < MIN_CHUNKS) {
            throw new Error(
                "The minimum of 3 audio fragments could not be obtained. Send a longer file."
            );
        }

        const streams = chunks.map((p) => fs.createReadStream(p));

        const voice = await getClient().voices.ivc.create({
            files: streams,
            name: voiceName,
        });

        return voice;
    } finally {
        removeFiles([originalPath, mp3Path, ...chunks]);
    }
}

module.exports = { createVoiceClone };
