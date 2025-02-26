const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware buat parsing JSON
app.use(express.json());

const WEMOS_IP = "http://192.168.1.225"; // Ganti dengan IP Wemos di jaringan lo

// Endpoint buat nerima webhook dari Saweria
app.post("/webhook/saweria", async (req, res) => {
  try {
    const { data } = req.body;

    // Cek nominal donasi (misalnya kalau di atas 10.000, trigger servo + lampu)
    if (data.amount >= 10000) {
      console.log(
        `Donasi Rp${data.amount} diterima, menyalakan lampu & servo!`
      );

      // Kirim perintah ke Wemos
      await axios.get(`${WEMOS_IP}/trigger`);
    }

    res.json({ success: true, message: "Webhook diterima" });
  } catch (error) {
    console.error("Error menerima webhook:", error);
    res.status(500).json({ success: false, message: "Error di server" });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
