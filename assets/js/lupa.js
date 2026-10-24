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

/* ---------- Cari akun ---------- */

function cariAkun(username, email) {
  const un = username.trim().toLowerCase();
  const em = email.trim().toLowerCase();

  return USERS().find(
    u => u.username.toLowerCase() === un && (u.email || '').toLowerCase() === em
  );
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

  const req = {
    nama: user.nama,
    username: user.username,
    email: user.email,
    waktu: new Date().toLocaleString('id-ID'),
  };
  const link = buatMailto(req);

  f.hidden = true;
  $('#ok').hidden = false;
  $('#mk').href = link;
  location.href = link; // buka aplikasi email otomatis
};