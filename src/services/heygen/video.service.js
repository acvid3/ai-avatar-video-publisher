const fs = require("fs");
const { api, upload, assertConfigured } = require("./client");
const { config } = require("../../config/env");

async function uploadVoice(filePath) {
    assertConfigured();
    const result = await upload.post("/v1/asset", fs.readFileSync(filePath), {
        headers: { "Content-Type": "audio/mpeg" },
    });

    return {
        id: result.data.data.id,
        url: result.data.data.url,
    };
}

async function generateAvatarVideo(avatarId, audioData) {
    assertConfigured();
    const response = await api.post("/v2/video/generate", {
        caption: false,
        dimension: { width: 720, height: 1280 },
        video_inputs: [
            {
                character: {
                    type: "talking_photo",
                    talking_photo_id: avatarId,
                },
                voice: {
                    type: "audio",
                    audio_url: audioData.url,
                },
            },
        ],
        folder_id: config.heygenFolderId,
    });
    return response.data;
}

async function checkVideoStatus(videoId) {
    assertConfigured();
    const response = await api.get("/v1/video_status.get", {
        params: { video_id: videoId },
    });
    return response.data;
}

module.exports = {
    uploadVoice,
    generateAvatarVideo,
    checkVideoStatus,
};
