const express = require("express");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Use all routes
app.use(routes);

// Error handler
app.use(errorMiddleware);

module.exports = app;