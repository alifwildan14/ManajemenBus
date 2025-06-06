// File: api/index.js

// Impor modul yang diperlukan
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');

console.log('Memulai server API di api/index.js...');

// Impor rute API dengan path yang disesuaikan
// Jika folder 'routes' sejajar dengan folder 'api', maka pathnya '../routes/api'
const kendaraanRoutes = require('../routes/api'); 
console.log('Rute kendaraan berhasil di-require dari api/index.js.');

// Inisialisasi aplikasi Express
const app = express();

// Middleware untuk logging setiap request yang masuk ke fungsi ini
app.use((req, res, next) => {
    // Log ini akan menunjukkan path yang sebenarnya 'dilihat' oleh Express
    console.log(`[Request Logger] Path: ${req.path}, OriginalURL: ${req.originalUrl}, Method: ${req.method}`);
    next();
});

// Middleware lain
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Koneksi ke MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ [api/index.js] MONGODB_URI tidak ditemukan di environment variables!');
} else {
    console.log('[api/index.js] Mencoba terhubung ke MongoDB...');
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('✅ [api/index.js] Berhasil terhubung ke MongoDB.'))
      .catch((err) => {
        console.error('❌ [api/index.js] Gagal terhubung ke MongoDB:', err.message);
      });
}

// Gunakan rute API dengan path mounting yang benar.
// Permintaan ke /models/kendaraan.js akan ditangani oleh router 'kendaraanRoutes'.
app.use('/models/kendaraan.js', kendaraanRoutes);
console.log('[api/index.js] Rute API telah di-mount di bawah /models/kendaraan.js.');


// Handler untuk rute yang tidak cocok di dalam Express untuk debugging
app.use((req, res) => {
    console.warn(`[404 Handler] Rute Express tidak ditemukan untuk path: ${req.path}`);
    res.status(404).json({ message: `Rute tidak ditemukan di dalam aplikasi Express: ${req.path}` });
});


// Untuk Vercel, ekspor aplikasi Express agar bisa ditangani oleh runtime @vercel/node
module.exports = app;
