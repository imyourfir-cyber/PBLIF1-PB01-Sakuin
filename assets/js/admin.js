function tampil() {
  const on = sessionStorage.sk_admin === '1'; $('#fa').hidden = on; $('#panel').hidden = !on; if (!on) return;
  $('#list').innerHTML = REQS().slice().reverse().map(r => `<div class="li"><div>${e(r.nama)}<small>@${e(r.username)} · ${e(r.email)} · ${e(r.waktu)}</small></div>
    ${r.status === 'Menunggu' ? `<button class="btn gold sm" style="width:auto;margin:0" onclick="reset(${r.id})">Reset</button>` : `<small>${e(r.status)}</small>`}</div>`).join('') || '<div class="empty">Belum ada permintaan.</div>';
}
function reset(id) {
  const rs = REQS(), r = rs.find(x => x.id === id), us = USERS(), u = us.find(x => x.username === r.username); if (!u) return;
  const ch = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let t = 'SKN-'; for (let i = 0; i < 6; i++) t += ch[Math.floor(Math.random() * ch.length)];
  u.password = t; u.wajibGanti = true; SAVE(us); r.status = 'Sudah direset'; SAVEREQ(rs);
  const body = `Halo ${u.nama},\n\nPassword akun Sakuin kamu sudah direset admin.\nUsername: ${u.username}\nPassword sementara: ${t}\n\nMasuk dengan password tersebut, lalu kamu akan diminta membuat password baru.`;
  $('#hasil').hidden = false;
  $('#hasil').innerHTML = `<b>Password sementara untuk @${e(u.username)}:</b><div class="serif" style="font-size:24px;color:var(--gold2);margin:6px 0">${t}</div>
   <a class="btn gold sm" style="width:auto;display:inline-block;margin:0" href="mailto:${encodeURIComponent(u.email)}?subject=${encodeURIComponent('Password Sementara Sakuin')}&body=${encodeURIComponent(body)}">Kirim ke email user</a>`;
  tampil();
}
function keluar() { sessionStorage.removeItem('sk_admin'); $('#hasil').hidden = true; tampil(); }
$('#fa').onsubmit = ev => {
  ev.preventDefault(); const f = ev.target;
  if (!ADMINS.includes(f.email.value.trim().toLowerCase()) || f.kode.value !== KODE_ADMIN) { $('#err').textContent = 'Email atau kode admin salah.'; return; }
  sessionStorage.sk_admin = '1'; tampil();
};
tampil();
