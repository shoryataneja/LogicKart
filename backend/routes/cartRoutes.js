const express = require("express");
const { addToCart, getCart, updateCartItem, removeCartItem } = require("../controllers/cartController");
const protect = require("../middleware/authMiddleware");
const { validate, cartItemSchema, updateCartSchema } = require("../services/validation");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, validate(cartItemSchema), addToCart);
router.put("/:productId", protect, validate(updateCartSchema), updateCartItem);
router.delete("/:productId", protect, removeCartItem);

module.exports = router;
