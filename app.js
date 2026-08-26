// ==========================================
// FUNGSI PAPAR SLIDER GURU DI INDEX.HTML
// ==========================================
async function paparSliderGuru() {
    const sliderTrack = document.querySelector('.slide-track');
    if (!sliderTrack) return; // Jika bukan di index.html, abaikan

    try {
        // 1. Ambil data dari koleksi "sliders" dalam Firebase
        const snapshot = await db.collection("sliders").orderBy("createdAt", "desc").get();
        
        if (snapshot.empty) {
            console.log("Tiada data guru dalam database untuk slider.");
            sliderTrack.innerHTML = "<div>Tiada rekod guru</div>";
            return;
        }

        let htmlGambar = "";

        // 2. Pusing (loop) setiap data guru
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // --- BAHAGIAN PEMBAIKAN GAMBAR (Mula) ---
            let originalUrl = data.imageUrl; // Pautan asal yang disimpan
            let directImageUrl = originalUrl; // Pautan yang akan kita guna

            // Jika pautan datang dari Google Drive, kita tukar formatnya
            if (originalUrl && originalUrl.includes("drive.google.com")) {
                // Kita guna trik menukar URL Drive kepada URL direct download uc?id=
                // Contoh asal: drive.google.com/file/d/ID_GAMBAR/view?usp=sharing
                // Tukar ke: drive.google.com/uc?export=view&id=ID_GAMBAR
                
                // Cari ID Gambar menggunakan Regex (Regular Expression)
                const driveIdMatch = originalUrl.match(/\/d\/(.+?)\/(view|edit)/);
                if (driveIdMatch && driveIdMatch[cite: 1]) {
                    const fileId = driveIdMatch[cite: 1];
                    directImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                } else {
                    // Cuba format ringkas drive.google.com/open?id=ID
                    const driveIdMatchSimple = originalUrl.match(/id=(.+?)(&|$)/);
                    if(driveIdMatchSimple && driveIdMatchSimple[cite: 1]) {
                        const fileId = driveIdMatchSimple[cite: 1];
                        directImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    }
                }
            }
            
            // Jika tiada URL gambar, kita guna gambar placeholder kosong
            if (!directImageUrl || directImageUrl === "") {
                directImageUrl = "https://via.placeholder.com/150?text=Tiada+Gambar";
            }
            // --- BAHAGIAN PEMBAIKAN GAMBAR (Tamat) ---

            // 3. Bina HTML dengan directImageUrl yang dibaiki
            htmlGambar += `
                <div class="slide">
                    <img src="${directImageUrl}" alt="Gambar ${data.name}" title="${data.name} - ${data.role}" 
                         onerror="this.src='https://via.placeholder.com/150?text=Ralat+Gambar'">
                </div>
            `;
        });

        // Trik Infinite Scroll: Ganda dua kod HTML supaya bersambung
        sliderTrack.innerHTML = htmlGambar + htmlGambar;

    } catch (error) {
        console.error("Ralat ketika menarik data slider: ", error);
        sliderTrack.innerHTML = "<div>Gagal memuatkan gambar</div>";
    }
}

// ==========================================
// KOD ASAL ANDA (Telah digabungkan)
// ==========================================
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
                if(sidebar) sidebar.classList.remove("blurred"); // letak if(sidebar) sebagai langkah berjaga-jaga
                alert("Mod Pelawat Diaktifkan. Akses rujukan sahaja diberikan.");
            });
        }

        if (btnGuru) {
            btnGuru.addEventListener("click", () => {
                window.location.href = "paparan_guru.html";
            });
        }

        // --- Hentikan animasi slider apabila dihalakan (Hover) ---
        // Fungsi ini dikekalkan kerana ia sangat baik untuk UX pengguna
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

    // 3. JALANKAN SEMUA FUNGSI APABILA HALAMAN DIBUKA
    loadNavbar();          // Muatkan navbar[cite: 5]
    paparSliderGuru();     // Tarik dan papar gambar dari Firebase
});
