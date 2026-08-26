// --- HUBUNGAN KE FIREBASE ---
const db = firebase.firestore();

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
});
