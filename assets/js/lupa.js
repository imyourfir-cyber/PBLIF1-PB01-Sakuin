const mailto = r => 'mailto:' + ADMINS.join(',') + '?subject=' + encodeURIComponent('Permintaan Reset Password Sakuin') +
  '&body=' + encodeURIComponent(`Halo Admin,\n\nSaya meminta reset password akun Sakuin.\n\nNama: ${r.nama}\nUsername: ${r.username}\nEmail: ${r.email}\nWaktu: ${r.waktu}\n\nMohon dibantu reset password saya. Terima kasih.`);
$('#f').onsubmit = ev => {
  ev.preventDefault(); const f = ev.target, em = f.email.value.trim().toLowerCase();
  const u = USERS().find(x => x.username.toLowerCase() === f.username.value.trim().toLowerCase() && (x.email || '').toLowerCase() === em);
  if (!u) { $('#err').textContent = 'Username dan email tidak cocok dengan akun mana pun.'; return; }
  const r = { id: Date.now(), username: u.username, nama: u.nama, email: u.email, waktu: new Date().toLocaleString('id-ID'), status: 'Menunggu' };
  SAVEREQ(REQS().filter(x => !(x.username === u.username && x.status === 'Menunggu')).concat(r));
  f.hidden = true; $('#ok').hidden = false; $('#mk').href = mailto(r); location.href = mailto(r);
};
