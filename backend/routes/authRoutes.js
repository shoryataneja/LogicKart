const express = require("express");
const { registerUser, loginUser, getMe, updateProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const { validate, registerSchema, loginSchema, updateProfileSchema } = require("../services/validation");

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
