// ==========================================
// MODUL 1: PENGURUSAN PERANAN GURU (TAB 1)
// ==========================================

// Fungsi untuk panggil senarai pengguna dari Firebase
async function renderUserList() {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:15px;'>⏳ Memuat turun data pengguna...</td></tr>";

    try {
        const snapshot = await db.collection("users").get();
        tableBody.innerHTML = ""; // Kosongkan jadual

        if (snapshot.empty) {
            tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:15px; color:#64748b;'>Tiada rekod pengguna. Pangkalan data masih kosong.</td></tr>";
            return;
        }

        snapshot.forEach(doc => {
            const user = doc.data();
            const uid = doc.id;
            
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid #e2e8f0";
            
            // Senarai peranan yang ada dalam sistem
            const roles = [
                { value: "guru_biasa", label: "Guru Biasa" },
                { value: "penasihat", label: "Guru Penasihat" },
                { value: "penyelaras", label: "Penyelaras Koku" },
                { value: "susukan", label: "SU Sukan" },
                { value: "sukoku", label: "SU Kokurikulum" },
                { value: "pkko", label: "PK Kokurikulum" },
                { value: "admin", label: "Pentadbir (Admin Utama)" }
            ];

            let roleOptions = "";
            roles.forEach(r => {
                const isSelected = (user.role === r.value) ? "selected" : "";
                roleOptions += `<option value="${r.value}" ${isSelected}>${r.label}</option>`;
            });

            tr.innerHTML = `
                <td style="padding: 12px;">${user.email || 'Tiada E-mel'}</td>
                <td style="padding: 12px;">${user.name || 'Belum Daftar Nama'}</td>
                <td style="padding: 12px;">
                    <select id="role-${uid}" style="padding: 6px; border-radius: 4px; border: 1px solid #cbd5e1; width: 100%;">
                        ${roleOptions}
                    </select>
                </td>
                <td style="padding: 12px; text-align: center;">
                    <button onclick="updateUserRole('${uid}')" style="background: #10b981; color: white; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">Simpan</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Ralat memuat turun pengguna:", error);
        tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:15px; color:red;'>Gagal menyambung ke pangkalan data. Sila periksa tetapan Firebase.</td></tr>";
    }
}

// Fungsi untuk kemas kini peranan ke Firebase
async function updateUserRole(uid) {
    const newRole = document.getElementById(`role-${uid}`).value;
    try {
        await db.collection("users").doc(uid).update({
            role: newRole
        });
        alert("✅ Peranan berjaya dikemas kini!");
    } catch (error) {
        console.error("Ralat kemas kini:", error);
        alert("❌ Gagal mengemaskini peranan. " + error.message);
    }
}

// Muatkan data secara automatik apabila Admin Console dibuka
document.addEventListener("DOMContentLoaded", () => {
    renderUserList();
    renderSliderList(); // Tambah baris ini untuk muatkan jadual slider
});


// ==========================================
// MODUL 3: PENGURUSAN SLIDER (TAB 3)
// ==========================================

// Fungsi pembantu untuk menukar fail gambar menjadi Base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Fungsi pembantu mengekstrak ID fail Google Drive ke format pautan gambar sah
function formatDriveUrl(rawUrl) {
    if (!rawUrl) return "https://via.placeholder.com/150?text=Tiada+Gambar";
    // Cari susunan ID Google Drive (biasanya 25-50 aksara)
    const match = rawUrl.match(/[-\w]{25,}/);
    if (match) {
        return `https://lh3.googleusercontent.com/d/${match[0]}`;
    }
    return rawUrl;
}

// Fungsi panggil senarai slider dalam Admin Panel
async function renderSliderList() {
    const tableBody = document.getElementById("sliderTableBody");
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:15px;'>⏳ Memuat turun data slider...</td></tr>";

    try {
        const snapshot = await db.collection("sliders").get();
        tableBody.innerHTML = "";

        if (snapshot.empty) {
            tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:15px; color:#64748b;'>Tiada data guru untuk slider setakat ini.</td></tr>";
            return;
        }

        snapshot.forEach(doc => {
            const slider = doc.data();
            const id = doc.id;
            const displayImageUrl = formatDriveUrl(slider.imageUrl);
            
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid #e2e8f0";

            tr.innerHTML = `
                <td style="padding: 12px; text-align: center;">
                    <img src="${displayImageUrl}" alt="Gambar" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; border: 2px solid #cbd5e1;" onerror="this.src='https://via.placeholder.com/50?text=Ralat'">
                </td>
                <td style="padding: 12px; font-weight: 600;">${slider.name}</td>
                <td style="padding: 12px; color: #64748b;">${slider.role}</td>
                <td style="padding: 12px; text-align: center;">
                    <button onclick="deleteSlider('${id}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">🗑️ Buang</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Ralat memuat turun slider:", error);
        tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:15px; color:red;'>Gagal menyambung ke pangkalan data.</td></tr>";
    }
}

// Fungsi muat naik ke Google Drive melalui Google Apps Script
async function addSlider() {
    const name = document.getElementById("newSliderName").value.trim();
    const role = document.getElementById("newSliderRole").value.trim();
    const fileInput = document.getElementById("newSliderImageFile");
    const file = fileInput.files[0];

    if (!name || !role || !file) {
        alert("⚠️ Sila isi nama, jawatan, dan muat naik gambar!");
        return;
    }

    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Memuat naik ke Google Drive...";
    btn.disabled = true;

    try {
        const base64Data = await readFileAsBase64(file);
        
        // Pautan Google Apps Script anda
        const scriptUrl = "https://script.google.com/macros/s/AKfycbzpX9ZnuO2ru4Cv9E0a4kDMHo036KXgwv9GQxrkd61_cw5iNubl86dvxWbEotXPp_ND/exec"; 

        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify({
                filename: Date.now() + '_' + file.name,
                mimeType: file.type,
                base64: base64Data
            }),
            headers: {
                "Content-Type": "text/plain;charset=utf-8" 
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            await db.collection("sliders").add({
                name: name,
                role: role,
                imageUrl: result.url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("✅ Gambar berjaya disimpan di Drive dan pangkalan data dikemas kini!");
            
            document.getElementById("newSliderName").value = "";
            document.getElementById("newSliderRole").value = "";
            fileInput.value = "";
            
            renderSliderList();
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error("Ralat upload Drive:", error);
        alert("❌ Gagal memuat naik gambar. " + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Fungsi untuk buang slider dari pangkalan data
async function deleteSlider(id) {
    const confirmDelete = confirm("Adakah anda pasti mahu membuang guru ini dari slider?");
    if (!confirmDelete) return;

    try {
        await db.collection("sliders").doc(id).delete();
        alert("✅ Guru telah dibuang dari slider.");
        renderSliderList(); // Refresh jadual
    } catch (error) {
        console.error("Ralat buang slider:", error);
        alert("❌ Gagal membuang guru. " + error.message);
    }
}
