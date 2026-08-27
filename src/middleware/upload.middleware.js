const fs = require("fs");
const path = require("path");
const multer = require("multer");

const audioDir = path.join(__dirname, "..", "..", "tmp", "audio");
fs.mkdirSync(audioDir, { recursive: true });

const uploadAudio = multer({
    dest: audioDir,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("ERROR: Only audio or video files are allowed"));
        }
    },
});

const uploadImages = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 10,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"), false);
        }
    },
});

module.exports = { uploadAudio, uploadImages };
