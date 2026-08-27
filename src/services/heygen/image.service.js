const { upload, assertConfigured } = require("./client");

async function uploadSingleImage(imageData, mimeType) {
    try {
        assertConfigured();
        const response = await upload.post("/v1/asset", imageData, {
            headers: { "Content-Type": mimeType },
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response ? error.response.data : error.message,
        };
    }
}

async function uploadMultipleImages(images) {
    const results = [];

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        console.log(`[heygen] Uploading image ${i + 1} of ${images.length}...`);

        const result = await uploadSingleImage(image.buffer, image.mimetype);

        results.push({
            originalName: image.originalname,
            index: i,
            ...result,
        });

        if (i < images.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    return results;
}

module.exports = { uploadMultipleImages };
