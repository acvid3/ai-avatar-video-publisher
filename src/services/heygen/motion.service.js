const { api, assertConfigured } = require("./client");

const DEFAULT_MOTION_PROMPT =
    "a person talks about some new technologies, sometimes gestures with his hands";

async function addMotion(motionType, id, prompt = DEFAULT_MOTION_PROMPT) {
    try {
        assertConfigured();
        const response = await api.post("/v2/photo_avatar/add_motion", {
            motion_type: motionType,
            id,
            prompt,
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            error: error.response ? error.response.data : error.message,
        };
    }
}

module.exports = { addMotion };
