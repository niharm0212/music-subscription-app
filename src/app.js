const express = require("express");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Use all routes
app.use("/", routes);

// Error handler
app.use(errorMiddleware);

// 404 fallback (VERY IMPORTANT for debugging)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.url,
  });
});

module.exports = app;
