const express = require("express");
const path    = require("path");
const fs      = require("fs");

const router = express.Router();
const IMAGES_DIR = path.join(__dirname, "../images");

// GET /images/:filename
router.get("/:filename", (req, res) => {
  const { filename } = req.params;

  // Only allow safe filenames: alphanumeric, hyphens, spaces + image extensions
  if (!/^[a-z0-9 _-]+\.(svg|jpg|jpeg|png)$/.test(filename)) {
    return res.status(400).json({ success: false, message: "Invalid filename" });
  }

  const filePath = path.join(IMAGES_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "Image not found" });
  }

  const mimeTypes = {
    svg:  "image/svg+xml",
    jpg:  "image/jpeg",
    jpeg: "image/jpeg",
    png:  "image/png",
  };
  const ext = filename.split(".").pop();
  res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=86400"); // 24h cache
  res.sendFile(filePath);
});

module.exports = router;
