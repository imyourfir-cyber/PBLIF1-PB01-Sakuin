const us = USERS(), u = us.find(x => x.username === localStorage.sk_session);
if (!u) location.replace('login.html'); else if (!u.wajibGanti) location.replace('../pages/dashboard.html');
$('#f').onsubmit = ev => {
  ev.preventDefault(); const f = ev.target, m = $('#err');
  if (f.baru.value.length < 6) m.textContent = 'Password baru minimal 6 karakter.';
  else if (f.baru.value === u.password) m.textContent = 'Password baru tidak boleh sama dengan password sementara.';
  else if (f.baru.value !== f.konfirmasi.value) m.textContent = 'Konfirmasi password tidak sama.';
  else { u.password = f.baru.value; delete u.wajibGanti; SAVE(us); sessionStorage.flash = 'Password baru berhasil disimpan.'; location.href = '../pages/dashboard.html'; }
};
