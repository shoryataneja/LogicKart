const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // 1. Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 2. Find user's cart
    let cart = await Cart.findOne({ user: userId });

    // 3. If cart does not exist → create one
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }

    // 4. Check if product already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        price: product.price
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  addToCart
};