    // File: models/Kendaraan.js
    const mongoose = require('mongoose');

    console.log('[models/Kendaraan.js] Skema Kendaraan dimuat.');

    const kendaraanSchema = new mongoose.Schema({
        namaSopir: {
            type: String,
            required: [true, 'Nama sopir tidak boleh kosong']
        },
        nomorPolisi: {
            type: String,
            required: [true, 'Nomor polisi tidak boleh kosong'],
            unique: true, 
            uppercase: true,
            trim: true // Tambahkan trim untuk menghapus spasi ekstra
        },
        tipeKendaraan: {
            type: String,
            required: [true, 'Tipe kendaraan tidak boleh kosong'],
            enum: ['Big bus JB5', 'Big bus JB3/2', 'Medium bus', 'Elf', 'Hiace']
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
            min: 1980,
            max: new Date().getFullYear() + 2 // Izinkan tahun depan sedikit
        }
    }, { timestamps: true });

    kendaraanSchema.index({ nomorPolisi: 1 }, { unique: true });

    module.exports = mongoose.model('Kendaraan', kendaraanSchema);
    