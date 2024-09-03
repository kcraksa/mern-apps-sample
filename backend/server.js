const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Koneksi MongoDB lokal
mongoose
  .connect("mongodb://127.0.0.1:27017/mern_apps", {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/event", require("./routes/event"));

// Server listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
