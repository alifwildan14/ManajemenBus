// File: api/index.js

// Impor modul yang diperlukan
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Meskipun mungkin tidak banyak digunakan di API murni

console.log('Memulai server API...'); // Log awal

// Impor rute API dengan path yang disesuaikan
// Jika folder 'routes' sejajar dengan folder 'api', gunakan '../routes/api'
const kendaraanRoutes = require('../routes/api'); 
console.log('Rute kendaraan berhasil di-require.');

// Inisialisasi aplikasi Express
const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Koneksi ke MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan di environment variables!');
} else {
    console.log('Mencoba terhubung ke MongoDB...');
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('✅ Berhasil terhubung ke MongoDB.'))
      .catch((err) => {
        console.error('❌ Gagal terhubung ke MongoDB:', err.message);
        console.error('Detail Error MongoDB:', err); // Log detail error
      });
}

// Gunakan rute API
// Karena vercel.json merutekan "/api/(.*)" ke "api/index.js",
// path yang dilihat Express di sini kemungkinan sudah tanpa prefix /api.
// Jadi, jika request asli adalah /api/kendaraan, Express akan melihat /kendaraan.
app.use('/kendaraan', kendaraanRoutes); 
console.log('Rute /kendaraan telah di-mount ke kendaraanRoutes.');

// Rute dasar untuk mengecek apakah API (fungsi serverless ini) berjalan
// Akan merespons pada GET request ke /api/ (jika Vercel strip /api, ini jadi root Express)
app.get('/', (req, res) => {
    console.log('GET request ke / (base API) diterima');
    res.status(200).json({ message: 'API Serverless (fungsi api/index.js) Berjalan!' });
});


// Untuk Vercel, ekspor aplikasi Express agar bisa ditangani oleh runtime @vercel/node
module.exports = app; 
