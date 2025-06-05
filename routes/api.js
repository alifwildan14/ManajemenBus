    // File: routes/api.js
    const express = require('express');
    const router = express.Router();
    // Jika folder 'models' sejajar dengan folder 'routes', maka pathnya '../models/Kendaraan'
    const Kendaraan = require('../models/kendaraan'); 

    console.log('[routes/api.js] Rute API kendaraan dimuat.');

    // CREATE - Menambah data kendaraan baru (Method: POST ke /kendaraan)
    router.post('/', async (req, res) => {
        console.log('[routes/api.js] POST / diterima, body:', req.body);
        try {
            const kendaraanBaru = new Kendaraan({
                namaSopir: req.body.namaSopir,
                nomorPolisi: req.body.nomorPolisi,
                tipeKendaraan: req.body.tipeKendaraan,
                seat: req.body.seat,
                nomorTelepon: req.body.nomorTelepon,
                masaBerlakuKIR: req.body.masaBerlakuKIR,
                tahunKendaraan: req.body.tahunKendaraan
            });
            const savedKendaraan = await kendaraanBaru.save();
            console.log('[routes/api.js] Kendaraan berhasil disimpan:', savedKendaraan);
            res.status(201).json(savedKendaraan);
        } catch (error) {
            console.error('[routes/api.js] Error saat POST /:', error.message);
            if (error.code === 11000 && error.keyPattern && error.keyPattern.nomorPolisi) { 
                return res.status(400).json({ message: `Nomor Polisi "${req.body.nomorPolisi}" sudah terdaftar.` });
            }
            if (error.name === 'ValidationError') {
                let errors = {};
                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });
                return res.status(400).json({ message: "Data tidak valid", errors });
            }
            res.status(500).json({ message: "Terjadi kesalahan pada server saat membuat data", error: error.message });
        }
    });

    // READ - Mendapatkan semua data kendaraan (Method: GET ke /kendaraan)
    router.get('/', async (req, res) => {
        console.log('[routes/api.js] GET / diterima');
        try {
            const semuaKendaraan = await Kendaraan.find().sort({ createdAt: -1 });
            // console.log('[routes/api.js] Data kendaraan ditemukan:', semuaKendaraan); // Bisa sangat banyak, hati-hati di produksi
            res.json(semuaKendaraan);
        } catch (error) {
            console.error('[routes/api.js] Error saat GET /:', error.message);
            res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
        }
    });

    // READ - Mendapatkan satu data kendaraan berdasarkan ID (Method: GET ke /kendaraan/:id)
    router.get('/:id', async (req, res) => {
        console.log(`[routes/api.js] GET /:id diterima, id: ${req.params.id}`);
        try {
            const kendaraan = await Kendaraan.findById(req.params.id);
            if (!kendaraan) {
                console.warn(`[routes/api.js] Kendaraan dengan ID ${req.params.id} tidak ditemukan.`);
                return res.status(404).json({ message: "Data kendaraan tidak ditemukan" });
            }
            // console.log('[routes/api.js] Kendaraan ditemukan:', kendaraan);
            res.json(kendaraan);
        } catch (error) {
            console.error(`[routes/api.js] Error saat GET /:id (${req.params.id}):`, error.message);
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                 return res.status(400).json({ message: "Format ID kendaraan tidak valid." });
            }
            res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
        }
    });

    // UPDATE - Mengubah data kendaraan berdasarkan ID (Method: PUT ke /kendaraan/:id)
    router.put('/:id', async (req, res) => {
        console.log(`[routes/api.js] PUT /:id diterima, id: ${req.params.id}, body:`, req.body);
        try {
            const updateData = { ...req.body };
            delete updateData.nomorPolisi; // Umumnya nomor polisi tidak diubah, atau perlu penanganan duplikasi khusus

            const updatedKendaraan = await Kendaraan.findByIdAndUpdate(
                req.params.id, 
                updateData, 
                { new: true, runValidators: true }
            );
            if (!updatedKendaraan) {
                console.warn(`[routes/api.js] Kendaraan dengan ID ${req.params.id} tidak ditemukan untuk diupdate.`);
                return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk diupdate" });
            }
            console.log('[routes/api.js] Kendaraan berhasil diupdate:', updatedKendaraan);
            res.json(updatedKendaraan);
        } catch (error) {
            console.error(`[routes/api.js] Error saat PUT /:id (${req.params.id}):`, error.message);
            if (error.name === 'ValidationError') {
                let errors = {};
                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });
                return res.status(400).json({ message: "Data tidak valid saat update", errors });
            }
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                 return res.status(400).json({ message: "Format ID kendaraan tidak valid untuk update." });
            }
            res.status(500).json({ message: "Gagal mengupdate data kendaraan", error: error.message });
        }
    });

    // DELETE - Menghapus data kendaraan berdasarkan ID (Method: DELETE ke /kendaraan/:id)
    router.delete('/:id', async (req, res) => {
        console.log(`[routes/api.js] DELETE /:id diterima, id: ${req.params.id}`);
        try {
            const deletedKendaraan = await Kendaraan.findByIdAndDelete(req.params.id);
            if (!deletedKendaraan) {
                console.warn(`[routes/api.js] Kendaraan dengan ID ${req.params.id} tidak ditemukan untuk dihapus.`);
                return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk dihapus" });
            }
            console.log('[routes/api.js] Kendaraan berhasil dihapus, ID:', req.params.id);
            res.json({ message: "Data kendaraan berhasil dihapus", id: req.params.id });
        } catch (error) {
            console.error(`[routes/api.js] Error saat DELETE /:id (${req.params.id}):`, error.message);
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                 return res.status(400).json({ message: "Format ID kendaraan tidak valid untuk dihapus." });
            }
            res.status(500).json({ message: "Gagal menghapus data kendaraan", error: error.message });
        }
    });

    module.exports = router;
    