/* ---------- Pengaturan ---------- */

// Alamat web aplikasi Sakuin. Ganti kalau alamatnya berbeda.
const APP_URL = './';

// Email tujuan form "Hubungi Kami"
const EMAIL_TUJUAN = ['imyourfir@gmail.com', 'ghizellarahmaazzahra@gmail.com'];

/* ---------- Helper ---------- */

const $ = s => document.querySelector(s);

/* ---------- Tautan aplikasi ---------- */

// elemen dengan data-app="halaman.html" menuju APP_URL + halaman.html
document.querySelectorAll('[data-app]').forEach(a => {
  a.href = APP_URL + a.dataset.app;
});

/* ---------- Tema gelap / terang ---------- */

const tombolTema = $('#tm');
const adalahTerang = () => document.body.classList.contains('light');

function perbaruiIkon() {
  tombolTema.textContent = adalahTerang() ? '☾' : '☀';
}

if (localStorage.tema === 'light') document.body.classList.add('light');

tombolTema.onclick = () => {
  document.body.classList.toggle('light');
  localStorage.tema = adalahTerang() ? 'light' : 'dark';
  perbaruiIkon();
};

perbaruiIkon();

/* ---------- Foto tim ---------- */

// Taruh file di assets/img/ (mis. safira.jpg, ghizella.jpg).
// Kalau file belum ada, yang tampil adalah inisial.
document.querySelectorAll('.tc .av').forEach(el => {
  const src = el.dataset.foto;
  const img = new Image();

  img.onload = () => {
    el.style.backgroundImage = `url('${src}'),linear-gradient(135deg,#f8e6ae,#e6bd62)`;
    el.textContent = '';
  };

  img.src = src;
});

/* ---------- Form kontak ---------- */

// Submit membuka aplikasi email yang sudah berisi pesan
$('#kf').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  const isi = `Nama: ${f.nama.value}\nEmail: ${f.email.value}\n\n${f.pesan.value}`;

  location.href =
    'mailto:' + EMAIL_TUJUAN.join(',') +
    '?subject=' + encodeURIComponent('Pesan dari web Sakuin') +
    '&body=' + encodeURIComponent(isi);

  $('#ok').textContent = 'Aplikasi email dibuka. Tekan Kirim di sana untuk mengirim pesanmu.';
  f.reset();
};