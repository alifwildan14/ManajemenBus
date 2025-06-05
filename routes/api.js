const express = require('express');
const router = express.Router();
const Kendaraan = require('../models/Kendaraan'); // Impor model Kendaraan

// --- RUTE CRUD (Create, Read, Update, Delete) ---

// CREATE - Menambah data kendaraan baru (Method: POST ke /api/kendaraan)
router.post('/', async (req, res) => {
    try {
        // Buat instance Kendaraan baru dengan data dari request body
        const kendaraanBaru = new Kendaraan({
            namaSopir: req.body.namaSopir,
            nomorPolisi: req.body.nomorPolisi,
            tipeKendaraan: req.body.tipeKendaraan,
            seat: req.body.seat,
            nomorTelepon: req.body.nomorTelepon,
            masaBerlakuKIR: req.body.masaBerlakuKIR,
            tahunKendaraan: req.body.tahunKendaraan
        });

        // Simpan data ke database
        const savedKendaraan = await kendaraanBaru.save();
        res.status(201).json(savedKendaraan); // Kirim respons sukses dengan data yang disimpan
    } catch (error) {
        // Tangani error, misalnya jika validasi gagal atau nomor polisi duplikat
        if (error.code === 11000 && error.keyPattern && error.keyPattern.nomorPolisi) { 
            // Error duplikat key untuk nomorPolisi unique
            return res.status(400).json({ message: `Nomor Polisi "${req.body.nomorPolisi}" sudah terdaftar.` });
        }
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Data tidak valid", errors });
        }
        // Error umum server
        console.error("Error saat membuat kendaraan:", error); // Log error di server
        res.status(500).json({ message: "Terjadi kesalahan pada server saat membuat data", error: error.message });
    }
});

// READ - Mendapatkan semua data kendaraan (Method: GET ke /api/kendaraan)
router.get('/', async (req, res) => {
    try {
        const semuaKendaraan = await Kendaraan.find().sort({ createdAt: -1 }); // Urutkan berdasarkan terbaru
        res.json(semuaKendaraan);
    } catch (error) {
        console.error("Error saat mengambil semua kendaraan:", error);
        res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
    }
});

// READ - Mendapatkan satu data kendaraan berdasarkan ID (Method: GET ke /api/kendaraan/:id)
router.get('/:id', async (req, res) => {
    try {
        const kendaraan = await Kendaraan.findById(req.params.id);
        if (!kendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan" });
        }
        res.json(kendaraan);
    } catch (error) {
        console.error(`Error saat mengambil kendaraan ID ${req.params.id}:`, error);
        // Jika ID tidak valid formatnya untuk MongoDB ObjectId
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
             return res.status(400).json({ message: "Format ID kendaraan tidak valid." });
        }
        res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
    }
});


// UPDATE - Mengubah data kendaraan berdasarkan ID (Method: PUT ke /api/kendaraan/:id)
router.put('/:id', async (req, res) => {
    try {
        // Pastikan nomorPolisi tidak diubah jika sudah ada (atau handle sesuai kebutuhan)
        // Untuk contoh ini, kita tidak memperbarui nomorPolisi karena biasanya itu adalah identifier unik yang tidak diubah.
        // Jika Anda ingin memperbolehkan update nomorPolisi, pastikan Anda menghandle potensi duplikasi.
        const updateData = { ...req.body };
        delete updateData.nomorPolisi; // Hapus nomorPolisi dari data update untuk mencegah perubahan

        const updatedKendaraan = await Kendaraan.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true } // new: true untuk mengembalikan dokumen yang sudah diupdate
                                              // runValidators: true untuk menjalankan validasi skema saat update
        );
        if (!updatedKendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk diupdate" });
        }
        res.json(updatedKendaraan);
    } catch (error) {
         if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Data tidak valid saat update", errors });
        }
        // Jika ID tidak valid formatnya untuk MongoDB ObjectId
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
             return res.status(400).json({ message: "Format ID kendaraan tidak valid untuk update." });
        }
        console.error(`Error saat mengupdate kendaraan ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Gagal mengupdate data kendaraan", error: error.message });
    }
});

// DELETE - Menghapus data kendaraan berdasarkan ID (Method: DELETE ke /api/kendaraan/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedKendaraan = await Kendaraan.findByIdAndDelete(req.params.id);
        if (!deletedKendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk dihapus" });
        }
        res.json({ message: "Data kendaraan berhasil dihapus", id: req.params.id });
    } catch (error) {
        // Jika ID tidak valid formatnya untuk MongoDB ObjectId
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
             return res.status(400).json({ message: "Format ID kendaraan tidak valid untuk dihapus." });
        }
        console.error(`Error saat menghapus kendaraan ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Gagal menghapus data kendaraan", error: error.message });
    }
});

module.exports = router;
