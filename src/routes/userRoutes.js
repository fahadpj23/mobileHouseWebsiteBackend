const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware.authenticate, authController.logout);

// Protected route example
router.get("/profile", authMiddleware.authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
