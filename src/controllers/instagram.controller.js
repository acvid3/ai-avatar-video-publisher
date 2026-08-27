const { publishReels } = require("../services/instagram.service");

async function publishInstagramHandler(req, res, next) {
    const { videoUrl, caption } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: "Required videoUrl" });
    }

    try {
        const result = await publishReels({ videoUrl, caption });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { publishInstagramHandler };
