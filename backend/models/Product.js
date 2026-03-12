const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0, // percentage, e.g. 15 means 15% off
    },
    brand: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
