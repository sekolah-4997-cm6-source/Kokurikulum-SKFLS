document.addEventListener("DOMContentLoaded", () => {
    
    // Kenal pasti elemen-elemen penting
    const sidebar = document.getElementById("sidebar");
    const btnPelawat = document.getElementById("btnPelawat");
    const btnGuru = document.getElementById("btnGuru");

    // Fungsi: Apabila klik 'Pelawat / Pegawai'
    btnPelawat.addEventListener("click", () => {
        // Buang efek blur pada navbar
        sidebar.classList.remove("blurred");
        
        // Notifikasi ringkas
        alert("Mod Pelawat Diaktifkan. Akses rujukan sahaja diberikan.");
        
        // Boleh ditambah logic di sini untuk membuang butang log masuk 
        // atau terus navigate ke muka surat Dashboard utama.
    });

    // Fungsi: Apabila klik 'Guru / Pentadbir' atau butang 'Log Masuk'
    const handleLoginClick = () => {
        // Untuk sekarang, kita keluarkan alert (Nanti kita ganti dengan sistem Firebase Auth)
        alert("Sistem Log Masuk DELIMa sedang disambungkan (Dalam Pembangunan).");
        
        // Contoh: Buka tetingkap pop-up Google Login
        // signInWithGoogle();
    };

    btnGuru.addEventListener("click", () => {
        // Bawa pengguna ke halaman pilihan peranan guru
        window.location.href = "paparan_guru.html";
        
    });    
    

    // Fungsi Interaktif: Hentikan animasi gambar apabila mouse berada di atasnya (Hover to pause)
    const slideTrack = document.querySelector(".slide-track");
    slideTrack.addEventListener("mouseover", () => {
        slideTrack.style.animationPlayState = "paused";
    });
    slideTrack.addEventListener("mouseout", () => {
        slideTrack.style.animationPlayState = "running";
    });

});
