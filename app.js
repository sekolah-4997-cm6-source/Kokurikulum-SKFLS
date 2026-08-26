// ==========================================
// FUNGSI PAPAR SLIDER GURU DI INDEX.HTML
// ==========================================
async function paparSliderGuru() {
    const sliderTrack = document.querySelector('.slide-track');
    if (!sliderTrack) return; // Jika bukan di index.html, abaikan

    try {
        // Ambil data dari koleksi "sliders" dalam Firebase
        const snapshot = await db.collection("sliders").orderBy("createdAt", "desc").get();
        
        if (snapshot.empty) {
            console.log("Tiada data guru dalam database untuk slider.");
            sliderTrack.innerHTML = "<div>Tiada rekod guru</div>";
            return;
        }

        let htmlGambar = "";

        // Pusing (loop) dan bina HTML untuk setiap gambar
        snapshot.forEach(doc => {
            const data = doc.data();
            htmlGambar += `
                <div class="slide">
                    <img src="${data.imageUrl}" alt="Gambar ${data.name}" title="${data.name} - ${data.role}">
                </div>
            `;
        });

        // Trik Infinite Scroll: Ganda dua kod HTML supaya bersambung
        sliderTrack.innerHTML = htmlGambar + htmlGambar;

    } catch (error) {
        console.error("Ralat ketika menarik data slider: ", error);
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
