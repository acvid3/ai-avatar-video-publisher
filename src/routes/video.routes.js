const { Router } = require("express");
const {
    generateVideoHandler,
    videoStatusHandler,
} = require("../controllers/video.controller");

const router = Router();

router.post("/api/generate-video", generateVideoHandler);
router.get("/api/video-status", videoStatusHandler);

module.exports = router;
