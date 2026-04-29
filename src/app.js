const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

// 🔥 ENABLE CORS (VERY IMPORTANT)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

// Parse JSON
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/", routes);

// Error handler
app.use(errorMiddleware);

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.url,
  });
});

module.exports = app;
