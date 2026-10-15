// ====== PENGATURAN ======
// Alamat web aplikasi Sakuin. Ganti kalau alamatnya berbeda.
const APP_URL = './';
// Email tujuan form "Hubungi Kami"
const EMAIL_TUJUAN = ['imyourfir@gmail.com', 'ghizellarahmaazzahra@gmail.com'];
// ========================

const $ = s => document.querySelector(s);
document.querySelectorAll('[data-app]').forEach(a => a.href = APP_URL + a.dataset.app);

// Tema gelap/terang
if (localStorage.tema === 'light') document.body.classList.add('light');
const ikon = () => $('#tm').textContent = document.body.classList.contains('light') ? '☾' : '☀';
$('#tm').onclick = () => { document.body.classList.toggle('light'); localStorage.tema = document.body.classList.contains('light') ? 'light' : 'dark'; ikon(); };
ikon();

// Foto tim: taruh file di assets/img/ (safira.jpg, ghizella.jpg). Kalau belum ada, tampil inisial.
document.querySelectorAll('.tc .av').forEach(el => {
  const f = el.dataset.foto, i = new Image();
  i.onload = () => { el.style.backgroundImage = `url('${f}'),linear-gradient(135deg,#f8e6ae,#e6bd62)`; el.textContent = ''; };
  i.src = f;
});

// Form kontak -> membuka aplikasi email berisi pesan
$('#kf').onsubmit = ev => {
  ev.preventDefault(); const f = ev.target;
  const body = `Nama: ${f.nama.value}\nEmail: ${f.email.value}\n\n${f.pesan.value}`;
  location.href = 'mailto:' + EMAIL_TUJUAN.join(',') + '?subject=' + encodeURIComponent('Pesan dari web Sakuin') + '&body=' + encodeURIComponent(body);
  $('#ok').textContent = 'Aplikasi email dibuka. Tekan Kirim di sana untuk mengirim pesanmu.'; f.reset();
};
