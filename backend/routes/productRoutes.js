const express = require("express");
const { getProducts , createProduct,getProductById,updateProduct} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

module.exports = router;