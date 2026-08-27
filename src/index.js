const express = require("express");
const { config, validateEnv } = require("./config/env");
const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

if (require.main === module) {
    validateEnv();

    app.listen(config.port, () => {
        console.log(`Server is running on http://localhost:${config.port}`);
    });
}

module.exports = app;
