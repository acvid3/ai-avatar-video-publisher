const axios = require("axios");
const { config } = require("../../config/env");

const api = axios.create({
    baseURL: "https://api.heygen.com",
    headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": config.heygenApiKey,
    },
});

const upload = axios.create({
    baseURL: "https://upload.heygen.com",
    headers: {
        "x-api-key": config.heygenApiKey,
    },
});

function assertConfigured() {
    if (!config.heygenApiKey) {
        throw new Error("HEYGEN_API_KEY is not configured");
    }
}

module.exports = { api, upload, assertConfigured };
