// File: seeder.js

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const mongoose = require("mongoose");

const userSeed = async () => {
  try {
    mongoose
      .connect("mongodb://127.0.0.1:27017/mern_apps", {})
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((err) => {
        console.log("MongoDB connection error", err);
      });

    // Cek apakah ada pengguna dengan username admin@admin.com di database
    const existingUser = await User.findOne({ email: "admin@admin.com" });

    // Jika tidak ada, tambahkan pengguna baru
    if (!existingUser) {
      // Hash password menggunakan bcrypt
      const hashedPassword = await bcrypt.hash("1234", 12); // Gunakan salt dengan cost 10

      // Buat pengguna baru
      const newUser = new User({
        email: "admin@admin.com",
        password: hashedPassword,
      });

      // Simpan pengguna ke database
      await newUser.save();

      console.log("Pengguna berhasil ditambahkan.");
    } else {
      console.log(
        "Pengguna dengan username admin@admin.com sudah ada di database."
      );
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat menambahkan pengguna:", error);
  }
};

// Panggil fungsi userSeed untuk memulai seeding
userSeed();
