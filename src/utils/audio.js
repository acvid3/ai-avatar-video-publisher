const fs = require("fs");
const path = require("path");
const { Writable } = require("stream");
const { finished } = require("stream/promises");
const os = require("os");
const ffmpeg = require("fluent-ffmpeg");

function convertToMp3(inputPath) {
    return new Promise((resolve, reject) => {
        const { dir, name } = path.parse(inputPath);
        const outputPath = path.join(dir, `${name}.mp3`);

        ffmpeg(inputPath)
            .toFormat("mp3")
            .on("end", () => resolve(outputPath))
            .on("error", reject)
            .save(outputPath);
    });
}

function splitAudio(filePath, chunkLengthSec = 30) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(os.tmpdir(), `chunks-${Date.now()}`);
        fs.mkdirSync(outputDir, { recursive: true });

        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);

            const duration = metadata.format.duration;
            const chunkPaths = [];
            const jobs = [];

            for (let i = 0; i < duration; i += chunkLengthSec) {
                const outputFile = path.join(outputDir, `chunk_${i}.mp3`);
                chunkPaths.push(outputFile);

                jobs.push(
                    new Promise((res, rej) => {
                        ffmpeg(filePath)
                            .setStartTime(i)
                            .setDuration(chunkLengthSec)
                            .output(outputFile)
                            .on("end", res)
                            .on("error", rej)
                            .run();
                    })
                );
            }

            Promise.all(jobs)
                .then(() => resolve(chunkPaths))
                .catch(reject);
        });
    });
}

async function saveStreamToFile(stream, filePath) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });

    const fileStream = fs.createWriteStream(filePath);
    stream.pipeTo(Writable.toWeb(fileStream));
    await finished(fileStream);

    return filePath;
}

function removeFiles(filePaths) {
    filePaths.forEach((p) => {
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
    });
}

module.exports = {
    convertToMp3,
    splitAudio,
    saveStreamToFile,
    removeFiles,
};
