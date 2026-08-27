const { api, assertConfigured } = require("./client");

async function createAvatarGroup(imageKey, name) {
    assertConfigured();
    const response = await api.post("/v2/photo_avatar/avatar_group/create", {
        name,
        image_key: imageKey,
    });
    return response.data;
}

async function addAvatarsToGroup(imageKeys, groupId) {
    assertConfigured();
    const response = await api.post("/v2/photo_avatar/avatar_group/add", {
        image_keys: imageKeys,
        group_id: groupId,
        name: "zxc",
    });
    return response.data;
}

async function createAvatar(images, name) {
    if (!images || images.length === 0) {
        throw new Error("No images provided");
    }

    if (images.length === 1) {
        return createAvatarGroup(images[0], name);
    }

    const group = await createAvatarGroup(images[0], name);
    const groupPhotos = await addAvatarsToGroup(images.slice(1), group.data.group_id);

    return { group, groupPhotos };
}

module.exports = { createAvatar };
