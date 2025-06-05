    // File: public/script.js
    // ... (kode lainnya tetap sama) ...

    const muatDataKendaraan = async () => {
        if (!cekLogin()) return; 

        loadingMessage.style.display = 'block';
        daftarKendaraanDiv.innerHTML = ''; 

        try {
            // URL API yang dipanggil oleh frontend
            const response = await fetch('/api/kendaraan'); // Ini akan menjadi https://<domain-anda>/api/kendaraan
            if (!response.ok) {
                // Coba dapatkan teks error jika ada, sebelum gagal parse JSON
                let errorText = `HTTP error! status: ${response.status}`;
                try {
                    const text = await response.text(); // Dapatkan respons sebagai teks dulu
                    console.error("Respons error mentah dari server (GET /api/kendaraan):", text);
                    // Anda bisa mencoba menampilkan 'text' ini jika JSON.parse gagal
                } catch (textError) {
                    // Abaikan jika gagal membaca teks
                }
                throw new Error(errorText);
            }
            const data = await response.json(); // Ini akan gagal jika respons bukan JSON
            
            loadingMessage.style.display = 'none';
            
            // ... (sisa kode untuk menampilkan data) ...
        } catch (error) {
            loadingMessage.style.display = 'none';
            daftarKendaraanDiv.innerHTML = '<p class="text-red-500 col-span-full text-center py-8">Gagal memuat data. Pastikan server backend berjalan dan API merespons dengan benar.</p>';
            console.error('Error fetching data (muatDataKendaraan):', error);
            showToast('Gagal memuat data kendaraan. Cek konsol untuk detail.', 'error');
        }
    };

    // ... (kode lainnya tetap sama) ...

    if (formKendaraan) {
        formKendaraan.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                // ... (data form) ...
            };

            // ... (validasi frontend) ...

            // URL API untuk POST/PUT
            const url = isEditMode ? `/api/kendaraan/${idKendaraanInput.value}` : '/api/kendaraan';
            const method = isEditMode ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                // Coba dapatkan teks dulu jika bukan JSON, untuk debugging
                if (!response.headers.get("content-type")?.includes("application/json")) {
                    const textResponse = await response.text();
                    console.error(`Respons non-JSON dari ${method} ${url}:`, textResponse);
                    // Tampilkan pesan error yang lebih informatif jika bukan JSON
                    if (!response.ok) {
                         showToast(`Server error (${response.status}): ${textResponse.substring(0,100)}`, 'error'); // Potong pesan jika terlalu panjang
                         return;
                    }
                }
                
                const responseData = await response.json(); // Ini akan gagal jika respons bukan JSON

                if (response.ok) {
                    // ... (logika sukses) ...
                } else {
                    // ... (logika error dari server) ...
                    showToast(errorMessage, 'error');
                }
            } catch (err) {
                // Error ini terjadi jika fetch gagal (mis. jaringan) ATAU response.json() gagal
                showToast(`Terjadi kesalahan (submit): ${err.message}. Pastikan server backend berjalan.`, 'error');
                console.error('Error submitting form:', err);
            }
        });
    }

    // ... (sisa kode script.js) ...
    