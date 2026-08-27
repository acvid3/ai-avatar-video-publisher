const { getProvider } = require("../services/providers");

async function createAvatarHandler(req, res, next) {
    const { images, name, provider: providerName } = req.body;

    if (!Array.isArray(images) || images.length === 0 || typeof name !== "string") {
        return res.status(400).json({
            error: "Invalid input: images (array) and name (string) are required",
        });
    }

    try {
        const provider = getProvider(providerName);
        const result = await provider.createAvatar(images, name);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

async function addMotionHandler(req, res, next) {
    const { motion_type, id, provider: providerName } = req.body;

    if (!motion_type || !id) {
        return res.status(400).json({
            success: false,
            error: "The motion_type, id fields are required",
        });
    }

    try {
        const provider = getProvider(providerName);
        const result = await provider.addMotion(motion_type, id);

        if (result.success === false) {
            return res.status(500).json(result);
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { createAvatarHandler, addMotionHandler };
