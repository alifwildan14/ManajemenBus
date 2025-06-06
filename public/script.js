document.addEventListener('DOMContentLoaded', () => {
    // === ELEMEN UMUM ===
    const loginContainer = document.getElementById('login-container');
    const adminContentContainer = document.getElementById('admin-content-container');
    const bodyElement = document.body;

    // === ELEMEN LOGIN ===
    const formLogin = document.getElementById('form-login');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorP = document.getElementById('login-error');
    const tombolLogout = document.getElementById('tombol-logout');

    // === ELEMEN FORM KENDARAAN ===
    // Pastikan deklarasi ini ada sebelum variabel digunakan
    const formKendaraan = document.getElementById('form-kendaraan');
    const idKendaraanInput = document.getElementById('id-kendaraan');
    const namaSopirInput = document.getElementById('namaSopir');
    const nomorPolisiInput = document.getElementById('nomorPolisi');
    const tipeKendaraanSelect = document.getElementById('tipeKendaraan');
    const seatSelect = document.getElementById('seat');
    const nomorTeleponInput = document.getElementById('nomorTelepon');
    const tahunKendaraanInput = document.getElementById('tahunKendaraan');
    const masaBerlakuKIRInput = document.getElementById('masaBerlakuKIR');
    const statusKIRInput = document.getElementById('statusKIR');
    const tombolSimpan = document.getElementById('tombol-simpan');
    const tombolReset = document.getElementById('tombol-reset');
    
    const daftarKendaraanDiv = document.getElementById('daftar-kendaraan');
    const loadingMessage = document.getElementById('loading-message');

    // Modal elements
    const deleteModal = document.getElementById('deleteConfirmationModal');
    const nomorPolisiHapusSpan = document.getElementById('nomorPolisiHapus');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let vehicleIdToDelete = null;

    // Toast Notification elements
    const toastNotification = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    // Deklarasi variabel lain
    let isEditMode = false;

    // === DATA UNTUK DROPDOWN SEAT ===
    const seatOptions = {
        'Big bus JB5': [50, 59],
        'Big bus JB3/2': [48, 59],
        'Medium bus': [23, 31, 32, 35],
        'Elf': [18],
        'Hiace': [14]
    };

    // === FUNGSI AUTENTIKASI (SANGAT DASAR) ===
    const NAMA_PENGGUNA_ADMIN = 'admin'; 
    const KATA_SANDI_ADMIN = 'admin'; 

    const cekLogin = () => {
        return sessionStorage.getItem('adminLoggedIn') === 'true';
    };

    const prosesLogin = (username, password) => {
        if (username === NAMA_PENGGUNA_ADMIN && password === KATA_SANDI_ADMIN) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            tampilkanKontenAdmin();
            loginErrorP.style.display = 'none';
            usernameInput.value = '';
            passwordInput.value = '';
        } else {
            loginErrorP.style.display = 'block';
            sessionStorage.removeItem('adminLoggedIn');
        }
    };

    const prosesLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        tampilkanFormLogin();
    };

    const tampilkanFormLogin = () => {
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (adminContentContainer) adminContentContainer.classList.add('hidden');
        if (bodyElement) {
            bodyElement.classList.add('flex', 'items-center', 'justify-center', 'min-h-screen');
            bodyElement.classList.remove('block');
        }
    };

    const tampilkanKontenAdmin = () => {
        if (loginContainer) loginContainer.classList.add('hidden');
        if (adminContentContainer) adminContentContainer.classList.remove('hidden');
        if (bodyElement) {
            bodyElement.classList.remove('flex', 'items-center', 'justify-center', 'min-h-screen');
            bodyElement.classList.add('block');
        }
        muatDataKendaraan();
    };

    // === FUNGSI UTILITAS ===
    const showToast = (message, type = 'success') => {
        if (!toastMessage || !toastNotification) return;
        toastMessage.textContent = message;
        toastNotification.className = `fixed bottom-5 right-5 text-white py-3 px-5 rounded-lg shadow-lg z-50 transition-all duration-300 opacity-0 transform ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
        toastNotification.style.display = 'block';
        setTimeout(() => {
            toastNotification.classList.remove('opacity-0', 'transform', 'scale-95', 'translate-y-2');
            toastNotification.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        }, 10);
        setTimeout(() => {
            toastNotification.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            toastNotification.classList.add('opacity-0', 'transform', 'scale-95', 'translate-y-2');
            setTimeout(() => {
                toastNotification.style.display = 'none';
            }, 300);
        }, 3000);
    };

    const resetFormKendaraan = () => {
        if (!formKendaraan) return;
        formKendaraan.reset();
        idKendaraanInput.value = '';
        isEditMode = false;
        tombolSimpan.textContent = 'Simpan Data';
        tombolSimpan.className = 'py-2.5 px-5 rounded-lg font-semibold shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95 text-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
        nomorPolisiInput.disabled = false;
        statusKIRInput.value = '';
        statusKIRInput.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-3 transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-indigo-300 bg-gray-100 cursor-not-allowed';
        updateSeatOptions();
    };

    // === FUNGSI LOGIKA KENDARAAN ===
    const updateSeatOptions = (selectedSeatValue = null) => {
        if (!tipeKendaraanSelect || !seatSelect) return;
        const selectedTipe = tipeKendaraanSelect.value;
        const options = seatOptions[selectedTipe] || [];
        seatSelect.innerHTML = ''; 
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = options.length === 0 ? '-- Pilih tipe kendaraan dulu --' : '-- Pilih Jumlah Seat --';
        seatSelect.appendChild(defaultOption);
        options.forEach(seat => {
            const option = document.createElement('option');
            option.value = seat;
            option.textContent = `${seat} Seat`;
            if (selectedSeatValue && parseInt(selectedSeatValue) === seat) {
                option.selected = true;
            }
            seatSelect.appendChild(option);
        });
    };

    const updateKIRStatus = () => {
        if (!masaBerlakuKIRInput || !statusKIRInput) return;
        const kirDateValue = masaBerlakuKIRInput.value;
        statusKIRInput.classList.remove('text-green-600', 'text-red-600', 'font-semibold');
        if (!kirDateValue) {
            statusKIRInput.value = '';
            return;
        }
        const kirDate = new Date(kirDateValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        statusKIRInput.classList.add('font-semibold');
        if (kirDate >= today) {
            statusKIRInput.value = 'Aktif';
            statusKIRInput.classList.add('text-green-600');
        } else {
            statusKIRInput.value = 'Nonaktif';
            statusKIRInput.classList.add('text-red-600');
        }
    };
    
    const muatDataKendaraan = async () => {
        if (!cekLogin() || !loadingMessage || !daftarKendaraanDiv) return; 
        loadingMessage.style.display = 'block';
        daftarKendaraanDiv.innerHTML = ''; 
        try {
            const response = await fetch('/api/kendaraan');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            loadingMessage.style.display = 'none';
            if (data.length === 0) {
                daftarKendaraanDiv.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Belum ada data kendaraan.</p>';
                return;
            }
            data.forEach(kendaraan => {
                // ... (sisa kode innerHTML tidak berubah)
                const today = new Date(); today.setHours(0,0,0,0);
                const kirExpiryDate = new Date(kendaraan.masaBerlakuKIR); kirExpiryDate.setHours(0,0,0,0);
                const status = kirExpiryDate >= today ? 'Aktif' : 'Nonaktif';
                const statusClass = status === 'Aktif' ? 'text-green-600' : 'text-red-600';
                const cardBorderClass = status === 'Aktif' ? 'border-green-500' : 'border-red-500';

                const card = document.createElement('div');
                card.className = `bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${cardBorderClass}`;
                card.innerHTML = `
                    <h3 class="text-xl font-semibold text-indigo-700 mb-3">${kendaraan.nomorPolisi}</h3>
                    <p class="text-sm text-gray-700 mb-1.5"><strong class="font-medium">Sopir:</strong> ${kendaraan.namaSopir}</p>
                    <p class="text-sm text-gray-700 mb-1.5"><strong class="font-medium">Tipe:</strong> ${kendaraan.tipeKendaraan} (${kendaraan.seat} seat)</p>
                    <p class="text-sm text-gray-700 mb-1.5"><strong class="font-medium">Telepon:</strong> ${kendaraan.nomorTelepon}</p>
                    <p class="text-sm text-gray-700 mb-1.5"><strong class="font-medium">Tahun:</strong> ${kendaraan.tahunKendaraan}</p>
                    <p class="text-sm text-gray-700 mb-1.5"><strong class="font-medium">KIR s/d:</strong> ${new Date(kendaraan.masaBerlakuKIR).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="text-sm text-gray-700 mb-3"><strong class="font-medium">Status KIR: <span class="${statusClass} font-semibold">${status}</span></strong></p>
                    <div class="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                        <button onclick="editKendaraan('${kendaraan._id}')" class="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 text-yellow-600 hover:text-yellow-700" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>
                        <button onclick="showDeleteConfirmation('${kendaraan._id}', '${kendaraan.nomorPolisi}')" class="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 text-red-600 hover:text-red-700" title="Hapus">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.094M7.094 7.548c.092.01.183.018.274.026M15.906 7.548c.091.01.183.018.274.026M12 17.25V8.25" /></svg>
                        </button>
                    </div>
                `;
                daftarKendaraanDiv.appendChild(card);
            });
        } catch (error) {
            loadingMessage.style.display = 'none';
            daftarKendaraanDiv.innerHTML = '<p class="text-red-500 col-span-full text-center py-8">Gagal memuat data. Pastikan server backend berjalan dan API merespons dengan benar.</p>';
            console.error('Error fetching data (muatDataKendaraan):', error);
            showToast('Gagal memuat data kendaraan. Cek konsol untuk detail.', 'error');
        }
    };

    window.editKendaraan = async (id) => {
        // ... (sisa fungsi tidak berubah)
    };
    window.showDeleteConfirmation = (id, nopol) => {
        // ... (sisa fungsi tidak berubah)
    };
    const hideDeleteModal = () => {
        // ... (sisa fungsi tidak berubah)
    };
    if (cancelDeleteButton) cancelDeleteButton.addEventListener('click', hideDeleteModal);
    if (confirmDeleteButton) confirmDeleteButton.addEventListener('click', async () => {
        // ... (sisa fungsi tidak berubah)
    });

    // === EVENT LISTENERS ===
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = usernameInput.value;
            const password = passwordInput.value;
            prosesLogin(username, password);
        });
    }

    if (tombolLogout) {
        tombolLogout.addEventListener('click', prosesLogout);
    }

    if (tipeKendaraanSelect) {
        tipeKendaraanSelect.addEventListener('change', () => updateSeatOptions());
    }
    if (masaBerlakuKIRInput) {
        masaBerlakuKIRInput.addEventListener('input', updateKIRStatus);
    }
    if (tombolReset) {
        tombolReset.addEventListener('click', resetFormKendaraan);
    }

    if (formKendaraan) {
        formKendaraan.addEventListener('submit', async (e) => {
            // ... (sisa fungsi tidak berubah)
        });
    }

    // === INISIALISASI HALAMAN ===
    if (cekLogin()) {
        tampilkanKontenAdmin();
    } else {
        tampilkanFormLogin();
    }
    
    updateSeatOptions(); 
    
    const currentYear = new Date().getFullYear();
    if (tahunKendaraanInput) {
        tahunKendaraanInput.max = currentYear + 1;
        tahunKendaraanInput.min = currentYear - 50; 
    }
});
