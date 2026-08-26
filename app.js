document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Fungsi untuk memuatkan navbar ke dalam semua halaman
    const loadNavbar = () => {
        fetch('navbar.html')
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuatkan navbar');
                return response.text();
            })
            .then(data => {
                // Masukkan kod navbar ke dalam container
                document.getElementById('navbar-container').innerHTML = data;
                
                // Selepas navbar siap dimuatkan, baru kita jalankan fungsi butang
                setupButtons();
            })
            .catch(error => console.error('Ralat:', error));
    };

    // 2. Fungsi untuk butang-butang pada halaman
    const setupButtons = () => {
        const sidebar = document.getElementById("sidebar");
        const btnPelawat = document.getElementById("btnPelawat");
        const btnGuru = document.getElementById("btnGuru");
        
        // --- Fungsi Halaman Utama (index.html) ---
        if (btnPelawat) {
            btnPelawat.addEventListener("click", () => {
                sidebar.classList.remove("blurred");
                alert("Mod Pelawat Diaktifkan. Akses rujukan sahaja diberikan.");
            });
        }

        if (btnGuru) {
            btnGuru.addEventListener("click", () => {
                window.location.href = "paparan_guru.html";
            });
        }

        // --- Hentikan animasi slider apabila dihalakan (Hover) ---
        const slideTrack = document.querySelector(".slide-track");
        if (slideTrack) {
            slideTrack.addEventListener("mouseover", () => {
                slideTrack.style.animationPlayState = "paused";
            });
            slideTrack.addEventListener("mouseout", () => {
                slideTrack.style.animationPlayState = "running";
            });
        }
    };

    // Mulakan proses memuatkan navbar
    loadNavbar();
});
