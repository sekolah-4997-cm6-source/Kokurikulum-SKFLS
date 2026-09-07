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

            // Tukar URL Drive ke format CDN
            if (data.imageUrl) {
                const match = data.imageUrl.match(/[-\w]{25,}/);
                if (match) {
                    directImageUrl = `https://lh3.googleusercontent.com/d/${match[0]}`;
                }
            }

            // Kemas kini: Tambah HTML untuk nama (slide-name) dan jawatan (slide-role)
            htmlGambar += `
                <div class="slide">
                    <img src="${directImageUrl}" alt="Gambar ${data.name}" 
                         onerror="this.src='https://via.placeholder.com/150?text=Ralat'">
                    <div class="slide-info">
                        <p class="slide-name">${data.name}</p>
                        <p class="slide-role">${data.role}</p>
                    </div>
                </div>
            `;
        });

        // Gandakan dua kali untuk kesan infinite scroll yang bersambung cantik
        sliderTrack.innerHTML = htmlGambar + htmlGambar;
        
        // Panggil fungsi auto-scroll pintar selepas gambar dimuatkan
        setupAutoScroll();

    } catch (error) {
        console.error("Ralat ketika menarik data slider: ", error);
        sliderTrack.innerHTML = "<div>Gagal memuatkan gambar</div>";
    }
}

// ==========================================
// FUNGSI AUTO-SCROLL PINTAR (BOLEH DI-SCROLL MANUAL)
// ==========================================
function setupAutoScroll() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    let scrollAmount = 1; // Kelajuan bergerak (tambah nombor untuk lebih laju)
    let scrollInterval;
    let isUserInteracting = false;
    let resumeTimeout;

    // Fungsi jalankan animasi scroll
    const startScroll = () => {
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            if (!isUserInteracting) {
                slider.scrollLeft += scrollAmount;
                
                // Jika dah sampai separuh jalan (kerana content didarab 2), 
                // patah balik ke mula secara senyap-senyap (seamless loop)
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    slider.scrollLeft = 0;
                }
            }
        }, 20); // ms kekerapan pergerakan
    };

    // Fungsi hentikan sementara bila pengguna klik/sentuh/scroll
    const stopScroll = () => {
        isUserInteracting = true;
        clearInterval(scrollInterval);
        clearTimeout(resumeTimeout);
        
        // Lepas pengguna berhenti kacau selama 2.5 saat, jalan balik
        resumeTimeout = setTimeout(() => {
            isUserInteracting = false;
            startScroll();
        }, 2500);
    };

    // Dengar tindak balas pengguna (scroll, touch, mouse)
    slider.addEventListener('mousedown', stopScroll);
    slider.addEventListener('touchstart', stopScroll, { passive: true });
    slider.addEventListener('wheel', stopScroll, { passive: true });
    slider.addEventListener('scroll', stopScroll, { passive: true });
    
    // Berhenti bila tetikus diletakkan di atas (hover)
    slider.addEventListener('mouseover', stopScroll);
    slider.addEventListener('mouseout', () => {
        // Cepatkan jalan semula bila tetikus dialihkan
        clearTimeout(resumeTimeout);
        isUserInteracting = false;
        startScroll();
    });

    // Mulakan pergerakan
    startScroll();
}

// ==========================================
// FUNGSI UTAMA (DIMUATKAN APABILA HALAMAN DIBUKA)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    const loadNavbar = () => {
        fetch('navbar.html')
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuatkan navbar');
                return response.text();
            })
            .then(data => {
                document.getElementById('navbar-container').innerHTML = data;
                setupButtons();
                setupNavLinks();
            })
            .catch(error => console.error('Ralat:', error));
    };

    const setupButtons = () => {
        const sidebar = document.getElementById("sidebar");
        const btnPelawat = document.getElementById("btnPelawat");
        const btnGuru = document.getElementById("btnGuru");
        
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
        
        // Logik memberhentikan animasi pada '.slide-track' telah dibuang dari sini 
        // kerana fungsi setupAutoScroll() di atas telah mengambil alih peranannya secara menyeluruh.
    };

    loadNavbar();          
    paparSliderGuru();     
});


// ==========================================
    // FUNGSI KLIK NAVBAR DAN TUKAR PAPARAN
    // ==========================================
    const setupNavLinks = () => {
        // Cari semua link (tag <a>) di dalam sub-menu navbar
        const navLinks = document.querySelectorAll('.nav-group ul li a');
        const mainContent = document.getElementById('main-content');
        
        // Simpan paparan asal (Dashboard) supaya boleh dipanggil semula jika perlu
        const paparanAsal = mainContent.innerHTML;

        // Beri fungsi kepada butang "Dashboard Utama"
        const linkDashboard = document.querySelector('.nav-main-link');
        if (linkDashboard) {
            linkDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                mainContent.innerHTML = paparanAsal; // Kembalikan paparan asal
            });
        }

        // Beri fungsi kepada setiap pilihan fail koku
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Halang page dari ter-refresh
                
                const tajukPilihan = e.target.innerText; // Ambil nama link yang ditekan
                
                // Panggil fungsi untuk lukis paparan jadual
                paparSenaraiDokumen(tajukPilihan, mainContent);
            });
        });
    };

    const paparSenaraiDokumen = (tajuk, mainContent) => {
        // Gantikan isi dalam tag <main> dengan HTML yang baru (Tajuk, Butang, Jadual)
        mainContent.innerHTML = `
            <header class="dashboard-header" style="align-items: flex-start; flex-direction: column; gap: 15px;">
                <div>
                    <h2>${tajuk}</h2>
                    <p style="color: #64748b;">Senarai dokumen yang telah dimuat naik untuk fail ini.</p>
                </div>
                <button id="btnMuatNaik" class="btn-action" style="width: auto; background-color: #10b981;">
                    📤 Muat Naik Dokumen Baharu
                </button>
            </header>

            <div class="table-container">
                <table class="doc-table">
                    <thead>
                        <tr>
                            <th style="width: 5%;">Bil</th>
                            <th style="width: 50%;">Nama Dokumen</th>
                            <th style="width: 20%;">Tarikh Dimuat Naik</th>
                            <th style="width: 25%;">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody id="senarai-dokumen-body">
                        <!-- Data dummy: Nanti akan disambung dengan Firebase -->
                        <tr>
                            <td colspan="4" style="text-align: center; padding: 30px; color: #64748b;">
                                Belum ada dokumen dimuat naik untuk <b>${tajuk}</b>.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Tambah fungsi untuk Butang Muat Naik jika mahu keluarkan popup/alert
        document.getElementById("btnMuatNaik").addEventListener("click", () => {
            alert("Fungsi muat naik akan memaparkan borang/popup selepas ini.");
        });
    };
