/* ---------- Email permintaan ke admin ---------- */

function buatMailto(req) {
  const subjek = 'Permintaan Reset Password Sakuin';
  const isi = [
    'Halo Admin,',
    '',
    'Saya meminta reset password akun Sakuin.',
    '',
    `Nama: ${req.nama}`,
    `Username: ${req.username}`,
    `Email: ${req.email}`,
    `Waktu: ${req.waktu}`,
    '',
    'Mohon dibantu reset password saya. Terima kasih.',
  ].join('\n');

  return (
    'mailto:' + ADMINS.join(',') +
    '?subject=' + encodeURIComponent(subjek) +
    '&body=' + encodeURIComponent(isi)
  );
}

/* ---------- Cari akun & simpan permintaan ---------- */

function cariAkun(username, email) {
  const un = username.trim().toLowerCase();
  const em = email.trim().toLowerCase();

  return USERS().find(
    u => u.username.toLowerCase() === un && (u.email || '').toLowerCase() === em
  );
}

function simpanPermintaan(user) {
  const req = {
    id: Date.now(),
    username: user.username,
    nama: user.nama,
    email: user.email,
    waktu: new Date().toLocaleString('id-ID'),
    status: 'Menunggu',
  };

  // satu pengguna hanya punya satu permintaan yang menunggu
  const sisa = REQS().filter(r => !(r.username === user.username && r.status === 'Menunggu'));
  SAVEREQ(sisa.concat(req));

  return req;
}

/* ---------- Form ---------- */

$('#f').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  const user = cariAkun(f.username.value, f.email.value);
  if (!user) {
    $('#err').textContent = 'Username dan email tidak cocok dengan akun mana pun.';
    return;
  }

  const req = simpanPermintaan(user);
  const link = buatMailto(req);

  f.hidden = true;
  $('#ok').hidden = false;
  $('#mk').href = link;
  location.href = link; // buka aplikasi email otomatis
};