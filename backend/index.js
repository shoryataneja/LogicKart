const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes    = require("./routes/cartRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const imageRoutes   = require("./routes/imageRoutes");
const errorHandler  = require("./middleware/errorMiddleware");

const app = express();

connectDB();

// Security headers — allow self-hosted SVG images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// CORS — allow frontend + image requests
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  exposedHeaders: ["Content-Type"],
}));

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});
app.use("/api/auth", authLimiter);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "LogicKart backend is alive" });
});

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/images",       imageRoutes);

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
