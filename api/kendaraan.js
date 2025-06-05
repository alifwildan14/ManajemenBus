import dbConnect from '../lib/dbConnect';
import Kendaraan from '../models/kendaraan';

export default async function handler(req, res) {
  await dbConnect(); // koneksi ke MongoDB

  if (req.method === 'POST') {
    const { nama, tipe } = req.body;
    if (!nama || !tipe) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    try {
      const kendaraanBaru = new Kendaraan({ nama, tipe });
      await kendaraanBaru.save();
      return res.status(200).json({ message: 'Berhasil disimpan', kendaraan: kendaraanBaru });
    } catch (err) {
      return res.status(500).json({ error: 'Gagal menyimpan data', detail: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method tidak diizinkan' });
  }
}
