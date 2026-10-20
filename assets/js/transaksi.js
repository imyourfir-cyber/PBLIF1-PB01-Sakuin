// Filter: semua kategori
$('#kf').innerHTML =
  '<option value="">Semua Kategori</option>' +
  K.map(k => `<option value="${k.id}">${e(k.nama)}</option>`).join('');

// Form modal: tiap opsi menyimpan jenisnya di data-j (dipakai filterKat)
$('#kopt').innerHTML = K.map(
  k => `<option value="${k.id}" data-j="${k.jenis}">${e(k.nama)}</option>`
).join('');

/* ---------- Tombol tambah ---------- */

$('#add').onclick = function () {
  this.dataset.d = JSON.stringify({ tanggal: TODAY });
  openM('m-trx', this);
};

/* ---------- Filter ---------- */

function cocokFilter(t, f) {
  const q = f.q.value.toLowerCase();
  const k = kat(t.kat);

  const cocokKata = !q || (t.ket + ' ' + k.nama).toLowerCase().includes(q);
  const cocokJenis = !f.jenis.value || k.jenis === f.jenis.value;
  const cocokKategori = !f.kategori.value || t.kat == f.kategori.value; // sengaja == (id angka vs string)
  const cocokDari = !f.dari.value || t.tgl >= f.dari.value;
  const cocokSampai = !f.sampai.value || t.tgl <= f.sampai.value;

  return cocokKata && cocokJenis && cocokKategori && cocokDari && cocokSampai;
}

/* ---------- Tabel ---------- */

function barisHtml(t, no) {
  const k = kat(t.kat);
  const masuk = k.jenis === 'Pemasukan';

  const dataEdit = dj({
    id: t.id,
    tanggal: t.tgl,
    jenis: k.jenis,
    kategori: t.kat,
    nominal: t.nom,
    keterangan: t.ket,
  });

  return `
    <tr>
      <td>${no}</td>
      <td>${tgl(t.tgl)}</td>
      <td><span class="tag ${masuk ? 'i' : 'o'}">${k.jenis}</span></td>
      <td>${e(k.nama)}</td>
      <td class="n">${rp(t.nom)}</td>
      <td>${e(t.ket || '-')}</td>
      <td class="n">
        <button type="button" class="btn sm" onclick="openM('m-trx',this)" data-d="${dataEdit}">Edit</button>
        <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button>
      </td>
    </tr>`;
}

function render() {
  const f = $('#fl').elements;

  // terbaru dulu; kalau tanggal sama, id terbesar dulu
  const rows = T
    .filter(t => cocokFilter(t, f))
    .sort((a, b) => b.tgl.localeCompare(a.tgl) || b.id - a.id);

  $('#tb').innerHTML =
    rows.map((t, i) => barisHtml(t, i + 1)).join('') ||
    '<tr><td colspan="7" class="empty">Data tidak ditemukan.</td></tr>';
}

/* ---------- Init ---------- */

$('#fl').onsubmit = ev => {
  ev.preventDefault();
  render();
};

render();