const express = require("express");
const { addToCart } = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add item to cart
router.post("/", protect, addToCart);

module.exports = router;