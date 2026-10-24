

/*  1. Tanggal
     Data dummy selalu jatuh di bulan berjalan. */

const NOW = new Date();
const Y = NOW.getFullYear();
const M = String(NOW.getMonth() + 1).padStart(2, '0');

// D(5) -> "2026-10-05" (tanggal 5 bulan ini)
const D = n => `${Y}-${M}-${String(n).padStart(2, '0')}`;
const TODAY = D(NOW.getDate());

/* 2. Akun
   Disimpan di localStorage browser (DEMO tanpa backend). */

const SEED = [
  { nama: 'Andi Pratama', username: 'andi', email: 'andi@email.com', nim: '2301234', password: '123456' },
];

// daftar akun; kalau belum ada yang tersimpan, pakai SEED
const USERS = () => {
  try {
    const u = JSON.parse(localStorage.sk_users);
    if (Array.isArray(u) && u.length) return u;
  } catch (_) { /* data rusak -> pakai SEED */ }
  return SEED.map(x => ({ ...x }));
};

const SAVE = u => {
  try {
    localStorage.sk_users = JSON.stringify(u);
    return true;
  } catch (_) {
    return false;
  }
};

// Email admin: tujuan permintaan reset password (dikirim lewat aplikasi email)
const ADMINS = ['imyourfir@gmail.com', 'ghizellarahmaazzahra@gmail.com'];

/* 3. Akun yang sedang login (ME)
   Nama di topbar & sapaan dashboard mengikuti ini. */

const ME = Object.assign(
  { nama: '', username: '', email: '', nim: '' },
  USERS().find(u => u.username === localStorage.sk_session)
);
ME.foto = ME.foto || '../assets/img/user_1.jpg';

function simpanMe() {
  const users = USERS();
  const i = users.findIndex(x => x.username === ME.username);

  if (i > -1) {
    Object.assign(users[i], { nama: ME.nama, email: ME.email, nim: ME.nim, foto: ME.foto });
    SAVE(users);
  }
}

/*  4a. Penyimpanan data keuangan (localStorage, terpisah per akun) */

const KEY = n => `sk_${localStorage.sk_session || 'tamu'}_${n}`;

// ambil data tersimpan; kalau belum ada pakai data awal (seed)
function muat(n, seed) {
  try {
    const d = JSON.parse(localStorage.getItem(KEY(n)));
    if (Array.isArray(d)) return d;
  } catch (_) { /* rusak -> pakai seed */ }
  return seed;
}

// simpan array ke localStorage
function simpan(n, arr) {
  try { localStorage.setItem(KEY(n), JSON.stringify(arr)); return true; }
  catch (_) { return false; }
}

// id berikutnya untuk array
const nextId = arr => Math.max(0, ...arr.map(x => x.id || 0)) + 1;

// simpan, tampilkan notifikasi setelah halaman dimuat ulang
function selesai(pesan) {
  sessionStorage.flash = pesan;
  location.reload();
}

/*  4. Data keuangan (dummy sebagai data awal) */

// Kategori
const K = muat('kat', [
  { id: 1, nama: 'Uang Saku', jenis: 'Pemasukan' },
  { id: 2, nama: 'Beasiswa', jenis: 'Pemasukan' },
  { id: 3, nama: 'Makan', jenis: 'Pengeluaran' },
  { id: 4, nama: 'Transportasi', jenis: 'Pengeluaran' },
  { id: 5, nama: 'Hiburan', jenis: 'Pengeluaran' },
]);

// Transaksi (kat = id kategori)
const T = muat('trx', [
  { id: 1, tgl: D(1), kat: 1, nom: 1500000, ket: 'Kiriman bulanan' },
  { id: 2, tgl: D(3), kat: 2, nom: 2000000, ket: 'Beasiswa semester ganjil' },
  { id: 3, tgl: D(2), kat: 3, nom: 45000, ket: 'Makan siang kantin' },
  { id: 4, tgl: D(4), kat: 4, nom: 30000, ket: 'Ojek online ke kampus' },
  { id: 5, tgl: D(6), kat: 3, nom: 120000, ket: 'Makan bareng teman' },
  { id: 6, tgl: D(7), kat: 5, nom: 75000, ket: 'Nonton bioskop' },
  { id: 7, tgl: D(9), kat: 3, nom: 85000, ket: 'Belanja bahan makanan' },
  { id: 8, tgl: D(10), kat: 4, nom: 50000, ket: 'Isi bensin' },
  { id: 9, tgl: D(12), kat: 3, nom: 90000, ket: 'Makan malam' },
]);

// Anggaran (kat = null berarti batas total bulanan)
const A = muat('ang', [
  { id: 1, kat: null, batas: 2000000 },
  { id: 2, kat: 3, batas: 300000 },
  { id: 3, kat: 5, batas: 150000 },
]);

// Target tabungan
const TB = muat('tb', [
  { id: 1, nama: 'Laptop baru', target: 8000000 },
  { id: 2, nama: 'Dana darurat', target: 2000000 },
]);

// Setoran tabungan (tb = id target)
const S = muat('set', [
  { tgl: D(5), tb: 1, nom: 500000 },
  { tgl: D(8), tb: 1, nom: 300000 },
  { tgl: D(11), tb: 2, nom: 200000 },
]);

/* 5. Fungsi bantu: format*/

const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// 1500000 -> "Rp 1.500.000"
const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

// "2026-10-05" -> "5 Okt 2026"
const tgl = s => {
  const [y, m, d] = s.split('-');
  return +d + ' ' + BLN[m - 1] + ' ' + y;
};

// escape HTML supaya teks pengguna aman dimasukkan ke innerHTML
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[c]));

// objek -> string JSON yang aman untuk atribut HTML (data-d)
const dj = x => e(JSON.stringify(x));

/* 6. Fungsi bantu: hitung*/

// cari kategori; == sengaja (id bisa angka atau string dari <select>)
const kat = id => K.find(k => k.id == id);

// jumlahkan nilai f(x) untuk semua x di arr
const jum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);

// total setoran untuk satu target tabungan
const terkumpul = id => jum(S.filter(s => s.tb == id), s => s.nom);

// [saldo tersedia, total tabungan]
function saldo() {
  const masuk = jum(T.filter(t => kat(t.kat).jenis === 'Pemasukan'), t => t.nom);
  const keluar = jum(T.filter(t => kat(t.kat).jenis === 'Pengeluaran'), t => t.nom);
  const tabungan = jum(S, s => s.nom);

  return [masuk - keluar - tabungan, tabungan];
}

// daftar anggaran + nama kategori + total pengeluaran yang sudah terpakai
function anggaran() {
  return A.map(a => ({
    ...a,
    nama: a.kat ? kat(a.kat).nama : null,
    pakai: jum(
      T.filter(t => kat(t.kat).jenis === 'Pengeluaran' && (!a.kat || t.kat == a.kat)),
      t => t.nom
    ),
  }));
}