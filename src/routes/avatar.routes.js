const { Router } = require("express");
const { createAvatarHandler, addMotionHandler } = require("../controllers/avatar.controller");

const router = Router();

router.post("/api/create-avatar", createAvatarHandler);
router.post("/api/add-motion", addMotionHandler);

module.exports = router;
