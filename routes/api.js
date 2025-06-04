const express = require('express');
const router = express.Router();

// Contoh endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Daftar kendaraan' });
});

module.exports = router;

// --- RUTE CRUD (Create, Read, Update, Delete) ---

// CREATE - Menambah data kendaraan baru
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
        if (error.code === 11000) { // Error duplikat key (untuk nomorPolisi unique)
            return res.status(400).json({ message: `Nomor Polisi "${req.body.nomorPolisi}" sudah terdaftar.` });
        }
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Data tidak valid", errors });
        }
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
});

// READ - Mendapatkan semua data kendaraan
router.get('/', async (req, res) => {
    try {
        const semuaKendaraan = await Kendaraan.find().sort({ createdAt: -1 }); // Urutkan berdasarkan terbaru
        res.json(semuaKendaraan);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
    }
});

// READ - Mendapatkan satu data kendaraan berdasarkan ID (opsional, jika diperlukan)
router.get('/:id', async (req, res) => {
    try {
        const kendaraan = await Kendaraan.findById(req.params.id);
        if (!kendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan" });
        }
        res.json(kendaraan);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kendaraan", error: error.message });
    }
});


// UPDATE - Mengubah data kendaraan berdasarkan ID
router.put('/:id', async (req, res) => {
    try {
        const updatedKendaraan = await Kendaraan.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // new: true untuk mengembalikan dokumen yang sudah diupdate
                                              // runValidators: true untuk menjalankan validasi skema saat update
        );
        if (!updatedKendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk diupdate" });
        }
        res.json(updatedKendaraan);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: `Nomor Polisi "${req.body.nomorPolisi}" sudah terdaftar.` });
        }
        if (error.name === 'ValidationError') {
            let errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({ message: "Data tidak valid saat update", errors });
        }
        res.status(500).json({ message: "Gagal mengupdate data kendaraan", error: error.message });
    }
});

// DELETE - Menghapus data kendaraan berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedKendaraan = await Kendaraan.findByIdAndDelete(req.params.id);
        if (!deletedKendaraan) {
            return res.status(404).json({ message: "Data kendaraan tidak ditemukan untuk dihapus" });
        }
        res.json({ message: "Data kendaraan berhasil dihapus", id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data kendaraan", error: error.message });
    }
});

module.exports = router;
