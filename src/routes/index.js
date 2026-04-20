const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const songController = require("../controllers/songController");
const subscriptionController = require("../controllers/subscriptionController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/songs", songController.getSongs);
router.post("/subscribe", subscriptionController.subscribe);
router.delete("/subscribe", subscriptionController.unsubscribe);
router.get("/subscriptions", subscriptionController.getSubscriptions);

module.exports = router;