const express = require("express");

const app = express();

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LogicKart backend is alive",
  });
});

// About route
app.get("/about", (req, res) => {
  res.json({
    success: true,
    message: "LogicKart backend about page",
  });
});

// Start server
app.listen(3002, () => {
  console.log("Server running on port 3002");
});
