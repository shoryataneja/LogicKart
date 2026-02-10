const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LogicKart backend is alive",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
