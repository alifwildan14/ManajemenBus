const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Sajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Terhubung ke MongoDB'))
  .catch((err) => console.error('❌ Gagal terhubung ke MongoDB:', err));

// Routing API
const kendaraanRoutes = require('./routes/api');
app.use('/api/kendaraan', kendaraanRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
