/* 22. Admin: daftar permintaan reset */

// satu baris permintaan; tombol Reset hanya untuk yang masih menunggu
const baris = r => `
  <div class="li">
    <div>${e(r.nama)}<small>@${e(r.username)} · ${e(r.email)} · ${e(r.waktu)}</small></div>
    ${r.status === 'Menunggu'
      ? `<button class="btn gold sm" style="width:auto;margin:0" onclick="reset(${r.id})">Reset</button>`
      : `<small>${e(r.status)}</small>`}
  </div>`;

// tampilkan form masuk atau panel admin, sesuai status login admin
function tampil() {
  const on = sessionStorage.sk_admin === '1';

  $('#fa').hidden = on;
  $('#panel').hidden = !on;
  if (!on) return;

  // permintaan terbaru di atas
  $('#list').innerHTML = REQS().slice().reverse().map(baris).join('')
    || '<div class="empty">Belum ada permintaan.</div>';
}

/* 23. Admin: reset password */

// password sementara acak, mis. "SKN-7QX2MD" (tanpa huruf/angka yang mirip)
const sandi = () => {
  const ch = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let t = 'SKN-';

  for (let i = 0; i < 6; i++) t += ch[Math.floor(Math.random() * ch.length)];
  return t;
};

// isi email yang dikirim ke user
const isiEmail = (u, t) =>
  `Halo ${u.nama},\n\n` +
  `Password akun Sakuin kamu sudah direset admin.\n` +
  `Username: ${u.username}\n` +
  `Password sementara: ${t}\n\n` +
  `Masuk dengan password tersebut, lalu kamu akan diminta membuat password baru.`;

function reset(id) {
  const rs = REQS(), r = rs.find(x => x.id === id);
  const us = USERS(), u = us.find(x => x.username === r.username);
  if (!u) return;

  const t = sandi();

  // user wajib ganti password saat masuk berikutnya
  u.password = t;
  u.wajibGanti = true;
  SAVE(us);

  r.status = 'Sudah direset';
  SAVEREQ(rs);

  // tampilkan password sementara + tombol kirim lewat email
  const mailto = 'mailto:' + encodeURIComponent(u.email)
    + '?subject=' + encodeURIComponent('Password Sementara Sakuin')
    + '&body=' + encodeURIComponent(isiEmail(u, t));

  $('#hasil').hidden = false;
  $('#hasil').innerHTML = `
    <b>Password sementara untuk @${e(u.username)}:</b>
    <div class="serif" style="font-size:24px;color:var(--gold2);margin:6px 0">${t}</div>
    <a class="btn gold sm" style="width:auto;display:inline-block;margin:0" href="${mailto}">Kirim ke email user</a>`;

  tampil();
}

/* 24. Admin: masuk & keluar */

function keluar() {
  sessionStorage.removeItem('sk_admin');
  $('#hasil').hidden = true;
  tampil();
}

// masuk panel admin: email harus terdaftar dan kode admin harus cocok
$('#fa').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  if (!ADMINS.includes(f.email.value.trim().toLowerCase()) || f.kode.value !== KODE_ADMIN) {
    $('#err').textContent = 'Email atau kode admin salah.';
    return;
  }

  sessionStorage.sk_admin = '1';
  tampil();
};

tampil();