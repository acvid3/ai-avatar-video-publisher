const { getProvider } = require("../services/providers");

async function uploadImagesHandler(req, res, next) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No image files found" });
        }

        const provider = getProvider(req.body.provider);
        const results = await provider.uploadImages(req.files);

        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;

        res.json({
            success: true,
            summary: {
                total: results.length,
                successful,
                failed,
            },
            results,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { uploadImagesHandler };
