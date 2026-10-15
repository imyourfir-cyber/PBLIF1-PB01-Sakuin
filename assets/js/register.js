$('#f').onsubmit = ev => {
  ev.preventDefault(); const f = ev.target, m = $('#err'), un = f.username.value.trim(), em = f.email.value.trim(), us = USERS();
  if (!/^[A-Za-z0-9_.]{3,50}$/.test(un)) m.textContent = 'Username 3-50 karakter: huruf, angka, titik, atau garis bawah.';
  else if (us.some(x => x.username.toLowerCase() === un.toLowerCase())) m.textContent = 'Username sudah dipakai.';
  else if (us.some(x => (x.email || '').toLowerCase() === em.toLowerCase())) m.textContent = 'Email sudah terdaftar.';
  else if (f.password.value.length < 6) m.textContent = 'Password minimal 6 karakter.';
  else if (f.password.value !== f.konfirmasi.value) m.textContent = 'Konfirmasi password tidak sama.';
  else {
    us.push({ nama: f.nama.value.trim(), username: un, email: em, nim: '', password: f.password.value }); SAVE(us);
    sessionStorage.flash = 'Akun berhasil dibuat. Silakan masuk.'; location.href = 'login.html';
  }
};
