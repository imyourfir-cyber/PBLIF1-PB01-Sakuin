let jenis = 'Pemasukan'; // tab yang sedang aktif
const tabs = document.querySelectorAll('.seg a');

/* ---------- Tabel ---------- */

function barisHtml(k, no) {
  // total nominal semua transaksi pada kategori ini
  const total = jum(T.filter(t => t.kat == k.id), t => t.nom); // sengaja == (id angka vs string)
  const dataEdit = dj({ id: k.id, nama: k.nama, jenis: k.jenis });

  return `
    <tr>
      <td>${no}</td>
      <td>${e(k.nama)}</td>
      <td class="n">${rp(total)}</td>
      <td class="n">
        <button type="button" class="btn sm" onclick="openM('m-kat',this)" data-d="${dataEdit}">Edit</button>
        <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button>
      </td>
    </tr>`;
}

function render() {
  const q = $('#fl').q.value.toLowerCase();

  const rows = K.filter(k => k.jenis === jenis && k.nama.toLowerCase().includes(q));

  $('#tb').innerHTML =
    rows.map((k, i) => barisHtml(k, i + 1)).join('') ||
    '<tr><td colspan="4" class="empty">Data tidak ditemukan.</td></tr>';
}

/* ---------- Tab jenis ---------- */

tabs.forEach(a => {
  a.onclick = ev => {
    ev.preventDefault();
    jenis = a.dataset.j;
    tabs.forEach(x => x.classList.toggle('on', x === a));
    render();
  };
});

/* ---------- Tombol tambah ---------- */

// jenis aktif dikirim ke modal supaya terpilih otomatis
$('#add').onclick = function () {
  this.dataset.d = JSON.stringify({ jenis });
  openM('m-kat', this);
};

/* ---------- Pencarian & init ---------- */

$('#fl').onsubmit = ev => {
  ev.preventDefault();
  render();
};

render();

/* ---------- Simpan (tambah / ubah) ---------- */

$('#m-kat form').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target.elements;
  const nama = f.nama.value.trim(), jenis = f.jenis.value;

  if (K.some(k => k.id != f.id.value && k.nama.toLowerCase() === nama.toLowerCase() && k.jenis === jenis))
    return toast('Kategori sudah ada.', true);

  if (f.id.value) Object.assign(K.find(k => k.id == f.id.value), { nama, jenis });
  else K.push({ id: nextId(K), nama, jenis });

  simpan('kat', K);
  selesai('Kategori berhasil disimpan.');
};
