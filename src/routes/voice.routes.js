const { Router } = require("express");
const { uploadAudio } = require("../middleware/upload.middleware");
const { cloneVoiceHandler } = require("../controllers/voice.controller");

const router = Router();

router.post("/api/clone-voice", uploadAudio.single("audio"), cloneVoiceHandler);

module.exports = router;
