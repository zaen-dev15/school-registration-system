document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    // Daftar ID input yang wajib divalidasi
    const fields = [
        'fullName', 'dob', 'gender', 'grade', 'address', 
        'email', 'phone', 'parentName', 'parentPhone'
    ];
    const termsCheckbox = document.getElementById('terms');

    // ==========================================================
    // Helper Functions untuk Menampilkan/Menghilangkan Error
    // ==========================================================

    /**
     * Menampilkan pesan error dan menandai field sebagai invalid.
     * @param {string} elementId ID dari elemen input/select/textarea.
     * @param {string} message Pesan error yang akan ditampilkan.
     */
    function showError(elementId, message) {
        const inputElement = document.getElementById(elementId);
        // Tentukan elemen error yang sesuai (khusus 'terms' memiliki ID yang berbeda)
        const errorElement = document.getElementById(elementId === 'terms' ? 'terms-error' : elementId + '-error');
        
        if (inputElement) inputElement.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Menghilangkan pesan error dan menghapus tanda invalid.
     * @param {string} elementId ID dari elemen input/select/textarea.
     */
    function clearError(elementId) {
        const inputElement = document.getElementById(elementId);
        const errorElement = document.getElementById(elementId === 'terms' ? 'terms-error' : elementId + '-error');

        if (inputElement) inputElement.classList.remove('invalid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // ==========================================================
    // Fungsi Validasi Client-Side
    // ==========================================================
    // Fungsi ini membantu memberikan umpan balik cepat sebelum data dikirim ke server.

    function validateRequiredField(id) {
        const input = document.getElementById(id);
        if (input.tagName === 'SELECT' && input.value === '') {
            showError(id, 'Anda harus memilih salah satu opsi.');
            return false;
        }
        if (input.value.trim() === '') {
            showError(id, 'Bidang ini wajib diisi.');
            return false;
        }
        clearError(id);
        return true;
    }

    function validateEmail(id) {
        const input = document.getElementById(id);
        if (!validateRequiredField(id)) return false; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            showError(id, 'Format email tidak valid (contoh: user@domain.com).');
            return false;
        }
        clearError(id);
        return true;
    }

    function validatePhone(id) {
        const input = document.getElementById(id);
        if (!validateRequiredField(id)) return false; 
        const phoneRegex = /^[0-9]{10,15}$/; // 10 to 15 digits
        if (!phoneRegex.test(input.value.trim())) {
            showError(id, 'Nomor telepon harus terdiri dari 10 hingga 15 digit angka.');
            return false;
        }
        clearError(id);
        return true;
    }

    function validateTerms() {
        if (!termsCheckbox.checked) {
            showError('terms', 'Anda harus menyetujui syarat dan ketentuan.');
            return false;
        }
        clearError('terms');
        return true;
    }

    // ==========================================================
    // Listeners untuk Validasi Real-time
    // ==========================================================

    fields.forEach(id => {
        const input = document.getElementById(id);
        
        // Tentukan fungsi validasi untuk blur (saat keluar dari field)
        let validationFunction;
        if (id === 'email') {
            validationFunction = () => validateEmail(id);
        } else if (id === 'phone' || id === 'parentPhone') {
            validationFunction = () => validatePhone(id);
        } else {
            validationFunction = () => validateRequiredField(id);
        }

        input.addEventListener('blur', validationFunction);
        input.addEventListener('input', () => {
            // Hapus tanda invalid saat user mulai mengetik/memilih
            if (input.classList.contains('invalid')) {
                clearError(id);
            }
        });
    });

    termsCheckbox.addEventListener('change', () => validateTerms());


    // ==========================================================
    // Penanganan Submit Formulir dan Komunikasi Backend
    // ==========================================================

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form dari submit default

        let isValid = true;
        const submitButton = form.querySelector('button[type="submit"]');

        // 1. Validasi Client-Side (Cepat)
        fields.forEach(id => {
            let fieldValid;
            if (id === 'email') {
                fieldValid = validateEmail(id);
            } else if (id === 'phone' || id === 'parentPhone') {
                fieldValid = validatePhone(id);
            } else {
                fieldValid = validateRequiredField(id);
            }
            if (!fieldValid) isValid = false;
        });
        if (!validateTerms()) isValid = false;


        if (isValid) {
            // 2. Kumpulkan data ke dalam objek JSON
            const formData = {
                fullName: document.getElementById('fullName').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                grade: document.getElementById('grade').value,
                address: document.getElementById('address').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                parentName: document.getElementById('parentName').value,
                parentPhone: document.getElementById('parentPhone').value,
                termsAgreed: termsCheckbox.checked
            };
            
            // Tampilkan status loading
            submitButton.textContent = 'Memproses...';
            submitButton.disabled = true;

            // 3. KIRIM DATA KE BACKEND PYTHON (FLASK)
            fetch('http://127.0.0.1:5001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                // Tangani respons server (termasuk error HTTP seperti 400)
                if (!response.ok) {
                    // Melemparkan error untuk ditangkap di blok .catch
                    return response.json().then(errorData => {
                        throw new Error(JSON.stringify(errorData));
                    });
                }
                return response.json();
            })
            .then(data => {
                // 4. Penanganan Sukses (Respons 201)
                alert(`Pendaftaran Berhasil! Server: ${data.message}`);
                form.reset(); 
                // Opsional: Hapus semua tanda error jika ada
                [...fields, 'terms'].forEach(clearError); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch((error) => {
                // 5. Penanganan Error (Validasi Backend atau Jaringan)
                console.error('Error saat pengiriman data:', error);
                
                let errorMessage = "Terjadi kesalahan jaringan atau server.";
                
                try {
                    const errorJson = JSON.parse(error.message);
                    if (errorJson.errors) {
                        // Error Validasi dari Backend (dikirim dalam format JSON 'errors')
                        errorMessage = "Validasi Gagal. Mohon periksa kembali input Anda.";
                        
                        // Hapus semua error frontend sebelum menampilkan error backend
                        [...fields, 'terms'].forEach(clearError);

                        // Tampilkan error yang spesifik dari backend
                        for (const [fieldId, msg] of Object.entries(errorJson.errors)) {
                            // Backend menggunakan key 'termsAgreed', frontend menggunakan 'terms'
                            const displayId = fieldId === 'termsAgreed' ? 'terms' : fieldId;
                            showError(displayId, msg);
                        }
                    } else if (errorJson.message) {
                        errorMessage = `Server Error: ${errorJson.message}`;
                    }
                } catch(e) {
                    // Jaringan error atau respons non-JSON
                }

                alert(`Pendaftaran Gagal!\n${errorMessage}`);
                
                // Scroll ke field pertama yang invalid
                const firstInvalidField = document.querySelector('.invalid');
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            })
            .finally(() => {
                // 6. Kembalikan tombol ke keadaan semula
                submitButton.textContent = 'Daftar Sekarang';
                submitButton.disabled = false;
            });
        } else {
            // Jika validasi client-side gagal
            alert('❌ Mohon periksa kembali form Anda. Ada kolom yang belum terisi atau tidak valid.');
            const firstInvalidField = document.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});