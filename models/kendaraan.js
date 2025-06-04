const mongoose = require('mongoose');

const kendaraanSchema = new mongoose.Schema({
    namaSopir: {
        type: String,
        required: [true, 'Nama sopir tidak boleh kosong']
    },
    nomorPolisi: {
        type: String,
        required: [true, 'Nomor polisi tidak boleh kosong'],
        unique: true, // Pastikan nomor polisi unik
        uppercase: true // Simpan dalam format uppercase
    },
    tipeKendaraan: {
        type: String,
        required: [true, 'Tipe kendaraan tidak boleh kosong'],
        enum: ['Big bus JB5', 'Big bus JB3/2', 'Medium bus', 'Elf', 'Hiace'] // Batasi pilihan
    },
    seat: {
        type: Number,
        required: [true, 'Jumlah seat tidak boleh kosong']
    },
    nomorTelepon: {
        type: String,
        required: [true, 'Nomor telepon tidak boleh kosong']
    },
    masaBerlakuKIR: {
        type: Date,
        required: [true, 'Masa berlaku KIR tidak boleh kosong']
    },
    tahunKendaraan: {
        type: Number,
        required: [true, 'Tahun kendaraan tidak boleh kosong'],
        min: 1980, // Batas minimal tahun
        max: new Date().getFullYear() + 1 // Batas maksimal tahun (tahun ini + 1)
    }
    // statusKIR tidak perlu disimpan di database, karena bisa dihitung secara dinamis
}, { timestamps: true }); // timestamps akan otomatis membuat field createdAt dan updatedAt

// Indeks untuk nomorPolisi untuk performa query dan memastikan keunikan
kendaraanSchema.index({ nomorPolisi: 1 }, { unique: true });

module.exports = mongoose.model('Kendaraan', kendaraanSchema);
