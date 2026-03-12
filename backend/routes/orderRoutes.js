const express = require("express");
const { createOrder, getUserOrders, getOrderById, mockPayment } = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.post("/payment", protect, mockPayment);

module.exports = router;
