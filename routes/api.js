// File: routes/api.js
const express = require('express');
const router = express.Router();
// Jika folder 'models' sejajar dengan folder 'routes', maka pathnya '../models/Kendaraan'
const Kendaraan = require('../models/kendaraan'); 

// READ - Mendapatkan semua data kendaraan (di-mount di GET /api/kendaraan)
router.get('/', async (req, res) => {
    try {
        const semuaKendaraan = await Kendaraan.find().sort({ createdAt: -1 });
        res.json(semuaKendaraan);
    } catch (error) {
        console.error('[routes/api.js] Error saat GET /:', error);
        res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
    }
});

// CREATE - Menambah data kendaraan baru (di-mount di POST /api/kendaraan)
router.post('/', async (req, res) => {
    try {
        const kendaraanBaru = new Kendaraan(req.body);
        const savedKendaraan = await kendaraanBaru.save();
        res.status(201).json(savedKendaraan);
    } catch (error) {
        console.error('[routes/api.js] Error saat POST /:', error);
        if (error.code === 11000) { 
            return res.status(400).json({ message: `Nomor Polisi "${req.body.nomorPolisi}" sudah terdaftar.` });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Data tidak valid", errors: error.errors });
        }
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
});

// READ - Mendapatkan satu data kendaraan berdasarkan ID (di-mount di GET /api/kendaraan/:id)
router.get('/:id', async (req, res) => {
    try {
        const kendaraan = await Kendaraan.findById(req.params.id);
        if (!kendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan" });
        }
        res.json(kendaraan);
    } catch (error) {
        console.error(`[routes/api.js] Error saat GET /:id (${req.params.id}):`, error);
        if (error.name === 'CastError') {
             return res.status(400).json({ message: "Format ID kendaraan tidak valid." });
        }
        res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
    }
});

// UPDATE - Mengubah data kendaraan berdasarkan ID (di-mount di PUT /api/kendaraan/:id)
router.put('/:id', async (req, res) => {
    try {
        const updatedKendaraan = await Kendaraan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedKendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk diupdate" });
        }
        res.json(updatedKendaraan);
    } catch (error) {
        console.error(`[routes/api.js] Error saat PUT /:id (${req.params.id}):`, error);
        // Tambahkan penanganan error yang lebih spesifik jika diperlukan
        res.status(500).json({ message: "Gagal mengupdate data", error: error.message });
    }
});

// DELETE - Menghapus data kendaraan berdasarkan ID (di-mount di DELETE /api/kendaraan/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedKendaraan = await Kendaraan.findByIdAndDelete(req.params.id);
        if (!deletedKendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk dihapus" });
        }
        res.json({ message: "Data kendaraan berhasil dihapus" });
    } catch (error) {
        console.error(`[routes/api.js] Error saat DELETE /:id (${req.params.id}):`, error);
        res.status(500).json({ message: "Gagal menghapus data", error: error.message });
    }
});

module.exports = router;
