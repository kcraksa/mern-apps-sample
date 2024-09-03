// Di file routes/event.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const nodemailer = require("nodemailer");

// Konfigurasi transporter untuk mengirim email
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "886839bacea937",
    pass: "7ce5c50fad9e19",
  },
});

// Route untuk menyimpan data event baru
router.post("/save", async (req, res) => {
  const { email, tanggal, description } = req.body;

  try {
    // Simpan data event ke dalam database
    const event = new Event({
      email,
      tanggal,
      description,
    });
    await event.save();

    // Kirim email ke alamat email yang diinput
    const mailOptions = {
      from: "585e185db1-fde37f@inbox.mailtrap.io", // Ganti dengan email Anda
      to: email,
      subject: "Informasi Event",
      text: "Hi salam kenal",
    };

    await transporter.sendMail(mailOptions);

    // Kirim respon jika penyimpanan berhasil
    res.json({ status: "success", message: "Data event berhasil disimpan" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/all", async (req, res) => {
  try {
    // Ambil semua data event dari tabel Event
    const events = await Event.find();

    // Kirim data event sebagai respons
    res.json({
      status: "success",
      data: events,
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Terjadi kesalahan saat mengambil data event.",
      });
  }
});

module.exports = router;
