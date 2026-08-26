// ==========================================
// FUNGSI PAPAR SLIDER GURU DI INDEX.HTML
// ==========================================
async function paparSliderGuru() {
    const sliderTrack = document.querySelector('.slide-track');
    if (!sliderTrack) return;

    try {
        const snapshot = await db.collection("sliders").orderBy("createdAt", "desc").get();
        
        if (snapshot.empty) {
            sliderTrack.innerHTML = "<div>Tiada rekod guru</div>";
            return;
        }

        let htmlGambar = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            let directImageUrl = "https://via.placeholder.com/150?text=Tiada+Gambar";

            // Tukar URL Drive ke format CDN Google
            if (data.imageUrl) {
                const match = data.imageUrl.match(/[-\w]{25,}/);
                if (match) {
                    directImageUrl = `https://lh3.googleusercontent.com/d/${match[0]}`;
                }
            }

            htmlGambar += `
                <div class="slide">
                    <img src="${directImageUrl}" alt="Gambar ${data.name}" title="${data.name} - ${data.role}" 
                         onerror="this.src='https://via.placeholder.com/150?text=Ralat+Gambar'">
                </div>
            `;
        });

        sliderTrack.innerHTML = htmlGambar + htmlGambar;

    } catch (error) {
        console.error("Ralat ketika menarik data slider: ", error);
        sliderTrack.innerHTML = "<div>Gagal memuatkan gambar</div>";
    }
}

// ==========================================
// FUNGSI UTAMA (DIMUATKAN APABILA HALAMAN DIBUKA)
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
                if(sidebar) sidebar.classList.remove("blurred");
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

    // 3. JALANKAN SEMUA FUNGSI
    loadNavbar();          // Panggil Navbar
    paparSliderGuru();     // Panggil Slider Gambar
});
