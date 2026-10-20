const KUNCI_SESI = 'sk_session';
const HALAMAN_DASHBOARD = '../pages/dashboard.html';
const HALAMAN_GANTI_PASSWORD = 'ganti-password.html';

/* ---------- Sesi ---------- */

const logout = new URLSearchParams(location.search).get('logout');
const sudahMasuk = USERS().some(u => u.username === localStorage[KUNCI_SESI]);

if (logout) {
  localStorage.removeItem(KUNCI_SESI);
} else if (sudahMasuk) {
  location.replace(HALAMAN_DASHBOARD);
}

/* ---------- Form ---------- */

$('#f').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  const username = f.username.value.trim().toLowerCase();
  const user = USERS().find(u => u.username.toLowerCase() === username);

  if (!user || user.password !== f.password.value) {
    $('#err').textContent = 'Username atau password salah.';
    return;
  }

  localStorage[KUNCI_SESI] = user.username;

  // habis direset admin -> wajib buat password baru
  location.href = user.wajibGanti ? HALAMAN_GANTI_PASSWORD : HALAMAN_DASHBOARD;
};