const KUNCI_SESI = 'sk_session';
const HALAMAN_LOGIN = 'login.html';
const HALAMAN_DASHBOARD = '../pages/dashboard.html';
const MIN_PASSWORD = 6;

const users = USERS();
const user = users.find(x => x.username === localStorage[KUNCI_SESI]);

/* ---------- Penjaga halaman ---------- */

if (!user) {
  // belum masuk
  location.replace(HALAMAN_LOGIN);
} else if (!user.wajibGanti) {
  // tidak sedang diwajibkan ganti password
  location.replace(HALAMAN_DASHBOARD);
}

/* ---------- Validasi ---------- */

/**
 * Mengembalikan pesan error pertama yang ditemukan, atau '' jika valid.
 */
function validasi(f) {
  if (f.baru.value.length < MIN_PASSWORD) {
    return `Password baru minimal ${MIN_PASSWORD} karakter.`;
  }
  if (f.baru.value === user.password) {
    return 'Password baru tidak boleh sama dengan password sementara.';
  }
  if (f.baru.value !== f.konfirmasi.value) {
    return 'Konfirmasi password tidak sama.';
  }
  return '';
}

/* ---------- Form ---------- */

$('#f').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  const error = validasi(f);
  if (error) {
    $('#err').textContent = error;
    return;
  }

  user.password = f.baru.value;
  delete user.wajibGanti;
  SAVE(users);

  sessionStorage.flash = 'Password baru berhasil disimpan.';
  location.href = HALAMAN_DASHBOARD;
};