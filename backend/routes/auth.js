const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Activity = require("../models/Activity");

// Route untuk login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Mencari user berdasarkan email di database MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Email tidak ditemukan",
      });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Password salah" });
    }

    // Jika email dan password valid, buat token JWT
    const token = jwt.sign({ email: user.email }, "jwtSecret");

    // Catat aktivitas login ke dalam database
    const activity = new Activity({
      user: user._id,
      type: "login",
    });
    await activity.save();

    res.json({ token, user: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route untuk logout
router.post("/logout", async (req, res) => {
  try {
    // Catat aktivitas logout ke dalam database
    const activity = new Activity({
      user: req.body.user._id, // Anda perlu memastikan user telah di-authenticated sebelum mencatat logout
      type: "logout",
    });
    await activity.save();

    res.json({ status: false, message: "Berhasil logout" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
