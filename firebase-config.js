// Konfigurasi Firebase (Gantikan dengan kunci dari Firebase Console anda)
const firebaseConfig = {
  apiKey: "AIzaSyC43rdHRfEKS2rrQKIv1jQBo_Ss4OqnnFE",
  authDomain: "kokurikulum-skfls.firebaseapp.com",
  projectId: "kokurikulum-skfls",
  storageBucket: "kokurikulum-skfls.firebasestorage.app",
  messagingSenderId: "591990818331",
  appId: "1:591990818331:web:18f62071c2d463d6309abe"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Inisialisasi Perkhidmatan (Auth & Firestore Database)
const auth = firebase.auth();
const db = firebase.firestore();
