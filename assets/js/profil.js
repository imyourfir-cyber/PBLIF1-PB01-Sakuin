const MAKS_FOTO = 2 * 1024 * 1024; // 2 MB

/* ---------- Informasi akun ---------- */

function infoHtml() {
  const baris = [
    ['Nama', ME.nama],
    ['Username', ME.username],
    ['Email', ME.email],
    ['NIM (opsional)', ME.nim],
  ];

  return baris
    .map(([label, nilai]) => `<div class="row"><span>${label}</span><b>${e(nilai || '-')}</b></div>`)
    .join('');
}

function tampilkanInfo() {
  $('#info').innerHTML = infoHtml();
}

/* ---------- Init tampilan ---------- */

$('#foto').style.backgroundImage = `url('${ME.foto}')`;
$('#un').value = ME.username;
tampilkanInfo();

/* ---------- Ubah profil ---------- */

$('#ubah').onclick = function () {
  this.dataset.d = JSON.stringify({ nama: ME.nama, email: ME.email, nim: ME.nim });
  openM('m-prof', this);
};

$('#fp').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  Object.assign(ME, {
    nama: f.nama.value,
    email: f.email.value,
    nim: f.nim.value,
  });
  simpanMe();

  tampilkanInfo();
  closeM();
  toast('Profil berhasil disimpan (demo).');
};

/* ---------- Ganti foto ---------- */

$('#ff').onchange = function () {
  const file = this.files[0];
  if (!file) return;

  if (file.size > MAKS_FOTO) {
    return toast('Foto maksimal 2 MB.', true);
  }

  const reader = new FileReader();

  reader.onload = () => {
    ME.foto = reader.result;
    simpanMe();

    // perbarui semua avatar di halaman (profil dan header)
    document.querySelectorAll('.av').forEach(av => {
      av.style.backgroundImage = `url('${reader.result}')`;
    });

    toast('Foto profil berhasil diubah (demo).');
  };

  reader.readAsDataURL(file);
};