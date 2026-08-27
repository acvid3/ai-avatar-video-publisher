const { Router } = require("express");
const uploadImagesRoutes = require("./upload-images.routes");
const avatarRoutes = require("./avatar.routes");
const voiceRoutes = require("./voice.routes");
const videoRoutes = require("./video.routes");
const instagramRoutes = require("./instagram.routes");

const router = Router();

router.use(uploadImagesRoutes);
router.use(avatarRoutes);
router.use(voiceRoutes);
router.use(videoRoutes);
router.use(instagramRoutes);

module.exports = router;
