const { Router } = require("express");
const { publishInstagramHandler } = require("../controllers/instagram.controller");

const router = Router();

router.post("/api/publish-instagram", publishInstagramHandler);

module.exports = router;
