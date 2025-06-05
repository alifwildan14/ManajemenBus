// Impor modul yang diperlukan
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 

// Impor rute API
const kendaraanRoutes = require('./routes/api');

// Inisialisasi aplikasi Express
const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Menyajikan file statis dari folder 'public' (HTML, CSS, JS Frontend)
// Vercel akan menangani ini berdasarkan vercel.json, tetapi ini tidak berbahaya
app.use(express.static(path.join(__dirname, 'public'))); 

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Berhasil terhubung ke MongoDB.')) // Cek log Vercel untuk pesan ini
  .catch((err) => console.error('❌ Gagal terhubung ke MongoDB:', err)); // Cek log Vercel

// Gunakan rute API
app.use('/api/kendaraan', kendaraanRoutes);

// Untuk Vercel, ekspor aplikasi Express agar bisa ditangani oleh runtime @vercel/node
module.exports = app; 
