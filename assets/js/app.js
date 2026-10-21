/* 11. Fungsi bantu: DOM */

const $ = s => document.querySelector(s);

/* 12. Kerangka halaman (sidebar, topbar, toast, modal global) */

const ORBS = '<div class="orbs"><i></i><i></i><i></i></div>';
const TOAST = '<div id="toast" class="glass"></div>';

// ikon menu sidebar (isi tag <svg>)
const IKON = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
  transaksi: '<path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4"/>',
  kategori: '<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8" cy="8" r="1.2"/>',
  anggaran: '<circle cx="12" cy="12" r="9"/><path d="M12 12V3M12 12l6.4 6.4"/>',
  tabungan: '<path d="M5 11a7 6 0 0 1 14 0v3a3 3 0 0 1-3 3h-1v2h-3v-2h-2v2H7v-3a5 5 0 0 1-2-4z"/><path d="M9 9h4"/>',
  laporan: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 13h7M9 17h7"/>',
  pengaturan: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
};

// modal hapus & ubah password (ada di semua halaman aplikasi)
const MODAL_HAPUS = `
  <div class="ov" id="m-del">
    <div class="glass modal">
      <h3>Hapus data?</h3>
      <p style="color:var(--mut);margin-top:8px">Data yang dihapus tidak dapat dikembalikan.</p>
      <div class="acts">
        <button type="button" class="btn" onclick="closeM()">Batal</button>
        <button type="button" class="btn gold" onclick="konfirmHapus()">Ya, hapus</button>
      </div>
    </div>
  </div>`;

const MODAL_PASS = `
  <div class="ov" id="m-pass">
    <form class="glass modal" data-demo="Password berhasil diubah." data-pass>
      <h3>Ubah Password</h3>
      <label>Password lama *</label><input type="password" name="lama" required>
      <label>Password baru *</label><input type="password" name="baru" required minlength="6">
      <label>Konfirmasi password baru *</label><input type="password" name="konfirmasi" required>
      <div class="acts">
        <button type="button" class="btn" onclick="closeM()">Batal</button>
        <button class="btn gold">Simpan</button>
      </div>
    </form>
  </div>`;

// satu menu sidebar; menu aktif mengikuti data-page di <body>
const navItem = (b, k, l) => `
  <a class="nav ${b.dataset.page === k ? 'on' : ''}" href="${k}.html">
    <svg viewBox="0 0 24 24">${IKON[k]}</svg><span>${l}</span>
  </a>`;

// halaman login / daftar (data-auth)
const htmlAuth = () => ORBS + `
  <div id="auth">
    <div class="authbox glass">
      <div class="brand">
        <img src="../assets/img/logo.png" alt="Sakuin">
        <h1>Sakuin</h1>
        <p>Catat uang sakumu, capai targetmu.</p>
      </div>
      <div class="authform" id="slot"></div>
    </div>
  </div>` + TOAST;

// halaman aplikasi: sidebar + topbar + modal global
function htmlApp(b) {
  const bg = `style="background-image:url('${ME.foto}')"`;

  return ORBS + `
    <div id="app" class="on">
      <aside class="glass">
        <div class="logo"><img src="../assets/img/logo.png" alt=""><b>Sakuin</b></div>
        ${navItem(b, 'dashboard', 'Dashboard')}
        ${navItem(b, 'transaksi', 'Transaksi')}
        ${navItem(b, 'kategori', 'Kategori')}
        ${navItem(b, 'anggaran', 'Anggaran')}
        ${navItem(b, 'tabungan', 'Tabungan')}
        ${navItem(b, 'laporan', 'Laporan')}
        <div class="sp"></div>
        ${navItem(b, 'pengaturan', 'Pengaturan')}
      </aside>
      <main>
        <header class="top glass">
          <h2>${b.dataset.title || ''}</h2>
          <div class="user">
            <button class="uname" onclick="toggleDD(event)">${e(ME.nama)}</button>
            <button class="av" ${bg} onclick="toggleDD(event)" aria-label="Menu pengguna"></button>
            <div class="dd glass" id="dd">
              <div class="ddh">
                <span class="av" ${bg}></span>
                <div><b>${e(ME.nama)}</b><small>@${e(ME.username)}</small></div>
              </div>
              <hr>
              <a href="profil.html">Profil</a>
              <a href="pengaturan.html">Pengaturan</a>
              <hr>
              <a class="dng" href="../auth/login.html?logout=1">Logout</a>
            </div>
          </div>
        </header>
        <div id="slot" style="display:contents"></div>
      </main>
    </div>` + TOAST + MODAL_HAPUS + MODAL_PASS;
}

function shell() {
  const b = document.body, src = $('#content');
  if (!src) return;

  // halaman aplikasi wajib login
  if (!b.hasAttribute('data-auth')) {
    const u = USERS().find(x => x.username === localStorage.sk_session);
    if (!u) return location.replace('../auth/login.html');
    if (u.wajibGanti) return location.replace('../auth/ganti-password.html');
  }

  if (localStorage.tema === 'light') b.classList.add('light');

  // isi halaman dipindah ke dalam kerangka (#slot)
  const kids = [...src.childNodes];
  src.remove();

  b.insertAdjacentHTML('afterbegin', b.hasAttribute('data-auth') ? htmlAuth() : htmlApp(b));
  $('#slot').append(...kids);
}

shell();

/* 13. Notifikasi (toast) */

function toast(m, bad) {                       // NFR-03
  if (localStorage.notif === 'off' && !bad) return;

  const t = $('#toast');
  t.textContent = (bad ? '✕  ' : '✓  ') + m;
  t.style.color = bad ? '#ffd0c6' : '#fff';
  t.classList.add('on');

  clearTimeout(t.h);
  t.h = setTimeout(() => t.classList.remove('on'), 2800 + m.length * 35);
}

/* 14. Dropdown & event global */

function toggleDD(ev) {
  ev.stopPropagation();
  $('#dd').classList.toggle('on');
}

// klik di luar dropdown menutupnya; klik latar gelap menutup modal
document.addEventListener('click', ev => {
  const d = $('#dd');
  if (d && !ev.target.closest('#dd')) d.classList.remove('on');
  if (ev.target.classList.contains('ov')) closeM();
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') closeM();
});

/* 15. Modal */

// openM('id') untuk form kosong, openM('id', tombol) untuk mengisi dari data-d (JSON)
function openM(id, el) {
  const o = $('#' + id), f = o.querySelector('form');
  $('#dd')?.classList.remove('on');

  if (f) {
    f.reset();

    const d = el && el.dataset && el.dataset.d ? JSON.parse(el.dataset.d) : {};
    for (const k in d) if (f.elements[k]) f.elements[k].value = d[k] ?? '';

    // judul berganti antara "tambah" dan "ubah"
    const h = f.querySelector('h3');
    if (h && h.dataset.add) h.textContent = d.id ? h.dataset.edit : h.dataset.add;

    if (f.elements.kategori && f.elements.jenis) filterKat(f);
  }

  o.classList.add('on');
}

function closeM() {
  document.querySelectorAll('.ov.on').forEach(o => o.classList.remove('on'));
}

// kategori pada form transaksi mengikuti jenis yang dipilih
function filterKat(f) {
  const j = f.elements.jenis.value, s = f.elements.kategori;

  [...s.options].forEach(o => { o.disabled = o.hidden = o.dataset.j !== j; });

  if (s.selectedOptions[0]?.disabled) {
    s.value = ([...s.options].find(o => !o.disabled) || {}).value || '';
  }
}

/* 16. Hapus data */

function hapus(btn) {                          // NFR-02
  window._b = btn;
  openM('m-del');
}

function konfirmHapus() {
  const btn = window._b;
  closeM();
  if (!btn) return;

  // id diambil dari tombol Edit di sebelahnya (data-d)
  const el = btn.parentElement.querySelector('[data-d]');
  const id = el ? JSON.parse(el.dataset.d).id : null;
  const hal = document.body.dataset.page;
  const buang = (arr, f) => { for (let i = arr.length - 1; i >= 0; i--) if (f(arr[i])) arr.splice(i, 1); };

  if (id == null) return toast('Data tidak ditemukan.', true);

  if (hal === 'transaksi') {
    buang(T, t => t.id == id);
    simpan('trx', T);
  } else if (hal === 'kategori') {
    if (T.some(t => t.kat == id)) return toast('Kategori masih dipakai transaksi, hapus transaksinya dulu.', true);
    buang(K, k => k.id == id);
    buang(A, a => a.kat == id);
    simpan('kat', K); simpan('ang', A);
  } else if (hal === 'anggaran') {
    buang(A, a => a.id == id);
    simpan('ang', A);
  } else if (hal === 'tabungan') {
    buang(TB, t => t.id == id);
    buang(S, s => s.tb == id);
    simpan('tb', TB); simpan('set', S);
  }

  selesai('Data berhasil dihapus.');
}

/* 17. Form modal (demo)
   Form bertanda data-demo hanya menampilkan notifikasi (tanpa backend). */

document.addEventListener('submit', ev => {
  const f = ev.target;
  if (!f.matches('[data-demo]')) return;
  ev.preventDefault();

  // form ubah password: cek dulu sebelum disimpan
  if (f.hasAttribute('data-pass')) {
    const us = USERS(), u = us.find(x => x.username === ME.username);

    if (!u || f.lama.value !== u.password) return toast('Password lama salah.', true);
    if (f.baru.value !== f.konfirmasi.value) return toast('Konfirmasi password tidak sama.', true);

    u.password = f.baru.value;
    SAVE(us);
  }

  closeM();
  toast(f.dataset.demo);
});

/* 18. Pengaturan (disimpan di browser) */

// samakan tampilan tombol notifikasi & tema dengan nilai tersimpan
function syncSet() {
  const tg = $('#tg');
  if (!tg) return;

  const on = localStorage.notif !== 'off';
  const l = document.body.classList.contains('light');

  tg.classList.toggle('on', on);
  $('#nt').textContent = on ? 'ON' : 'OFF';
  $('#t-dark').classList.toggle('on', !l);
  $('#t-light').classList.toggle('on', l);
}

function tglNotif() {
  const on = localStorage.notif !== 'off';

  if (on) toast('Notifikasi dimatikan.');     // tampil sebelum dimatikan
  localStorage.notif = on ? 'off' : 'on';
  syncSet();
  if (!on) toast('Notifikasi dinyalakan.');   // tampil setelah dinyalakan
}

function setTema(t) {
  localStorage.tema = t;
  document.body.classList.toggle('light', t === 'light');
  syncSet();
  return false;
}

syncSet();

/* 19. Pesan antar halaman
   Mis. setelah daftar / ganti password. */

if (sessionStorage.flash) {
  toast(sessionStorage.flash);
  sessionStorage.removeItem('flash');
}