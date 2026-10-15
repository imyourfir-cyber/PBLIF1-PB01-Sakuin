if (new URLSearchParams(location.search).get('logout')) localStorage.removeItem('sk_session');
else if (USERS().some(u => u.username === localStorage.sk_session)) location.replace('../pages/dashboard.html');
$('#f').onsubmit = ev => {
  ev.preventDefault(); const f = ev.target;
  const u = USERS().find(x => x.username.toLowerCase() === f.username.value.trim().toLowerCase());
  if (!u || u.password !== f.password.value) { $('#err').textContent = 'Username atau password salah.'; return; }
  localStorage.sk_session = u.username;
  location.href = u.wajibGanti ? 'ganti-password.html' : '../pages/dashboard.html';   // habis direset admin -> wajib buat password baru
};
