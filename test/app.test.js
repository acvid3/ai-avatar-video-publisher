const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/index");

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

function postJson(path, body) {
    return fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

test("GET /api/video-status without videoId → 400", async () => {
    const res = await fetch(`${baseUrl}/api/video-status`);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "Required videoId" });
});

test("POST /api/generate-video without required fields → 400", async () => {
    const res = await postJson("/api/generate-video", {});
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), {
        error: "Required text and avatarId",
    });
});

test("POST /api/create-avatar with invalid payload → 400", async () => {
    const res = await fetch(`${baseUrl}/api/create-avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: [], name: "" }),
    });
    assert.equal(res.status, 400);
});

test("POST /api/add-motion without required fields → 400", async () => {
    const res = await postJson("/api/add-motion", {});
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), {
        success: false,
        error: "The motion_type, id fields are required",
    });
});

test("POST /api/publish-instagram without videoUrl → 400", async () => {
    const res = await postJson("/api/publish-instagram", {});
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "Required videoUrl" });
});

test("POST /api/create-avatar with unknown provider → 500", async () => {
    const res = await postJson("/api/create-avatar", {
        provider: "nonexistent",
        images: ["https://example.com/a.png"],
        name: "Test",
    });
    assert.equal(res.status, 500);
});

test("POST /api/upload-images without files → 400", async () => {
    const res = await fetch(`${baseUrl}/api/upload-images`, { method: "POST" });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "No image files found" });
});

test("POST /api/upload-images with a non-image file → 400", async () => {
    const form = new FormData();
    form.append("images", new Blob(["hello"], { type: "text/plain" }), "test.txt");
    const res = await fetch(`${baseUrl}/api/upload-images`, {
        method: "POST",
        body: form,
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: "Only images are allowed" });
});

test("POST /api/clone-voice without audio file → 400", async () => {
    const form = new FormData();
    form.append("voiceName", "Test Voice");
    const res = await fetch(`${baseUrl}/api/clone-voice`, {
        method: "POST",
        body: form,
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), {
        error: "Required voiceName and audio file",
    });
});

test("POST /api/clone-voice with a non-audio file → 400", async () => {
    const form = new FormData();
    form.append("voiceName", "Test Voice");
    form.append("audio", new Blob(["hello"], { type: "text/plain" }), "test.txt");
    const res = await fetch(`${baseUrl}/api/clone-voice`, {
        method: "POST",
        body: form,
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), {
        error: "ERROR: Only audio or video files are allowed",
    });
});
