const { Router } = require("express");
const { uploadImages } = require("../middleware/upload.middleware");
const { uploadImagesHandler } = require("../controllers/upload-images.controller");

const router = Router();

router.post("/api/upload-images", uploadImages.array("images", 10), uploadImagesHandler);

module.exports = router;
