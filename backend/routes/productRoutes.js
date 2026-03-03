const express = require("express");
const { getProducts } = require("../controllers/productController");

const router = express.Router();

// GET all products
router.get("/", getProducts);

module.exports = router;