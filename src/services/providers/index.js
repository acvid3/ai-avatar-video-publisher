const heygen = require("./heygen");

const providers = { heygen };

function getProvider(name = "heygen") {
    const provider = providers[name];
    if (!provider) {
        throw new Error(`Unknown provider: ${name}. Available: ${Object.keys(providers).join(", ")}`);
    }
    return provider;
}

module.exports = { getProvider };
