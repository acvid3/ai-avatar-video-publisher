function errorHandler(err, req, res, next) {
    const multerMessage =
        err.message === "ERROR: Only audio or video files are allowed" ||
        err.message === "Only images are allowed"
            ? err.message
            : null;

    if (multerMessage) {
        return res.status(400).json({ error: multerMessage });
    }

    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
}

module.exports = { errorHandler };
