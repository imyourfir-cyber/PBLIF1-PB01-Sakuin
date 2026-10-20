const POLA_USERNAME = /^[A-Za-z0-9_.]{3,50}$/;

/**
 * Validasi form pendaftaran.
 * Mengembalikan pesan error pertama yang ditemukan, atau '' jika semua valid.
 */
function validasi(f, users) {
  const username = f.username.value.trim();
  const email = f.email.value.trim().toLowerCase();

  if (!POLA_USERNAME.test(username)) {
    return 'Username 3-50 karakter: huruf, angka, titik, atau garis bawah.';
  }
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return 'Username sudah dipakai.';
  }
  if (users.some(u => (u.email || '').toLowerCase() === email)) {
    return 'Email sudah terdaftar.';
  }
  if (f.password.value.length < 6) {
    return 'Password minimal 6 karakter.';
  }
  if (f.password.value !== f.konfirmasi.value) {
    return 'Konfirmasi password tidak sama.';
  }
  return '';
}

$('#f').onsubmit = ev => {
  ev.preventDefault();

  const f = ev.target;
  const users = USERS();
  const error = validasi(f, users);

  if (error) {
    $('#err').textContent = error;
    return;
  }

  users.push({
    nama: f.nama.value.trim(),
    username: f.username.value.trim(),
    email: f.email.value.trim(),
    nim: '',
    password: f.password.value,
  });
  SAVE(users);

  sessionStorage.flash = 'Akun berhasil dibuat. Silakan masuk.';
  location.href = 'login.html';
};