const { uploadMultipleImages } = require("../heygen/image.service");
const { createAvatar } = require("../heygen/avatar.service");
const { addMotion } = require("../heygen/motion.service");
const heygenVideo = require("../heygen/video.service");
const { textToSpeech } = require("../elevenlabs/tts.service");
const { removeFiles } = require("../../utils/audio");

async function generateVideo({ text, voiceId, avatarId }) {
    let filePath;

    try {
        filePath = await textToSpeech(text, voiceId);
        const audioData = await heygenVideo.uploadVoice(filePath);
        return heygenVideo.generateAvatarVideo(avatarId, audioData);
    } finally {
        removeFiles([filePath]);
    }
}

module.exports = {
    name: "heygen",
    uploadImages: uploadMultipleImages,
    createAvatar,
    addMotion,
    generateVideo,
    videoStatus: (videoId) => heygenVideo.checkVideoStatus(videoId),
};
