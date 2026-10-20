const JENIS_VALID = ['Pemasukan', 'Pengeluaran', 'Tabungan'];

// jenis awal bisa dari URL, mis. laporan.html?jenis=Tabungan
let jenis = new URLSearchParams(location.search).get('jenis');
if (!JENIS_VALID.includes(jenis)) jenis = 'Pemasukan';

const F = $('#fl').elements;
const tabs = document.querySelectorAll('.seg a');

/* ---------- Helper ---------- */

// apakah tanggal x ada di antara dari (a) dan sampai (b)? Batas kosong = tanpa batas
const dalamRentang = (x, a, b) => (!a || x >= a) && (!b || x <= b);

const opsi = (id, nama) => `<option value="${id}">${e(nama)}</option>`;

const barisKosong = kolom =>
  `<tr><td colspan="${kolom}" class="empty">Data tidak ditemukan.</td></tr>`;

function kartuStat({ label, nilai, kelasNilai = '', saldo = false }) {
  const kelasB = kelasNilai ? ` class="${kelasNilai}"` : '';
  return `
    <div class="glass stat${saldo ? ' sal' : ''}">
      <small>${label}</small>
      <b${kelasB}>${rp(nilai)}</b>
    </div>`;
}

function seksiTabel(judul, tabel) {
  return `
    <div class="glass pad">
      <h3 style="margin-bottom: 10px">${judul}</h3>
      <div class="tw">${tabel}</div>
    </div>`;
}

/* ---------- Dropdown kategori / target ---------- */

function isiDropdown(untukTabungan) {
  const sel = $('#sel');
  const dipilih = F.kat.value; // simpan pilihan sebelum opsi diganti

  sel.innerHTML = untukTabungan
    ? opsi('', 'Semua Target') + TB.map(t => opsi(t.id, t.nama)).join('')
    : opsi('', 'Semua Kategori') + K.filter(k => k.jenis === jenis).map(k => opsi(k.id, k.nama)).join('');

  // pulihkan pilihan jika masih ada di daftar baru
  const masihAda = [...sel.options].some(o => o.value === dipilih);
  sel.value = masihAda ? dipilih : '';
}

/* ---------- Laporan Tabungan ---------- */

function renderTabungan(dari, sampai, target) {
  const rows = S
    .filter(x => dalamRentang(x.tgl, dari, sampai) && (!target || x.tb == target)) // sengaja == (id angka vs string)
    .sort((a, b) => a.tgl.localeCompare(b.tgl));

  const totalSetor = jum(rows, x => x.nom);
  const [sisa, totalTabungan] = saldo();

  const kartu = `
    <div class="cards">
      ${kartuStat({ label: 'Total Disetor (periode ini)', nilai: totalSetor, kelasNilai: 'cin' })}
      ${kartuStat({ label: 'Total Tabungan (keseluruhan)', nilai: totalTabungan })}
      ${kartuStat({ label: 'Saldo Tersedia', nilai: sisa, saldo: true })}
    </div>`;

  const barisProgres = TB.map((r, i) => {
    const kumpul = terkumpul(r.id);
    const persen = Math.min(100, Math.round((kumpul / r.target) * 100));
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${e(r.nama)}</td>
        <td class="n">${rp(kumpul)}</td>
        <td class="n">${rp(r.target)}</td>
        <td class="n">${persen}%</td>
      </tr>`;
  }).join('');

  const tabelProgres = `
    <table>
      <thead>
        <tr>
          <th>No</th><th>Target</th>
          <th class="n">Terkumpul</th><th class="n">Target</th><th class="n">Progres</th>
        </tr>
      </thead>
      <tbody>${barisProgres}</tbody>
    </table>`;

  const barisRekap = rows.map((x, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${tgl(x.tgl)}</td>
        <td>${e(TB.find(t => t.id == x.tb).nama)}</td>
        <td class="n">${rp(x.nom)}</td>
      </tr>`).join('') || barisKosong(4);

  const tabelRekap = `
    <table>
      <thead>
        <tr><th>No</th><th>Tanggal</th><th>Target</th><th class="n">Nominal</th></tr>
      </thead>
      <tbody>${barisRekap}</tbody>
      <tfoot>
        <tr><td colspan="3" class="n">Total</td><td class="n">${rp(totalSetor)}</td></tr>
      </tfoot>
    </table>`;

  $('#out').innerHTML =
    kartu +
    seksiTabel('Progres per Target', tabelProgres) +
    seksiTabel('Rekap Tabungan', tabelRekap);
}

/* ---------- Laporan Pemasukan / Pengeluaran ---------- */

function renderTransaksi(dari, sampai, kategori) {
  const dalamPeriode = T.filter(t => dalamRentang(t.tgl, dari, sampai));
  const totalJenis = j => jum(dalamPeriode.filter(t => kat(t.kat).jenis === j), t => t.nom);

  const rows = dalamPeriode
    .filter(t => kat(t.kat).jenis === jenis && (!kategori || t.kat == kategori)) // sengaja ==
    .sort((a, b) => a.tgl.localeCompare(b.tgl) || a.id - b.id);

  const total = jum(rows, t => t.nom);
  const masuk = totalJenis('Pemasukan');
  const keluar = totalJenis('Pengeluaran');

  const kartu = `
    <div class="cards">
      ${kartuStat({ label: 'Total Pemasukan', nilai: masuk, kelasNilai: 'cin' })}
      ${kartuStat({ label: 'Total Pengeluaran', nilai: keluar, kelasNilai: 'cout' })}
      ${kartuStat({ label: 'Saldo', nilai: masuk - keluar, saldo: true })}
    </div>`;

  const barisRekap = rows.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${tgl(t.tgl)}</td>
        <td>${e(kat(t.kat).nama)}</td>
        <td>${e(t.ket || '-')}</td>
        <td class="n">${rp(t.nom)}</td>
      </tr>`).join('') || barisKosong(5);

  const tabelRekap = `
    <table>
      <thead>
        <tr><th>No</th><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th class="n">Nominal</th></tr>
      </thead>
      <tbody>${barisRekap}</tbody>
      <tfoot>
        <tr><td colspan="4" class="n">Total</td><td class="n">${rp(total)}</td></tr>
      </tfoot>
    </table>`;

  $('#out').innerHTML = kartu + seksiTabel(`Rekap ${jenis}`, tabelRekap);
}

/* ---------- Render utama ---------- */

function render() {
  const untukTabungan = jenis === 'Tabungan';

  tabs.forEach(a => a.classList.toggle('on', a.dataset.j === jenis));

  isiDropdown(untukTabungan);

  const dari = F.dari.value;
  const sampai = F.sampai.value;
  const pilihan = $('#sel').value;

  if (untukTabungan) renderTabungan(dari, sampai, pilihan);
  else renderTransaksi(dari, sampai, pilihan);
}

/* ---------- Event & init ---------- */

tabs.forEach(a => {
  a.onclick = ev => {
    ev.preventDefault();
    jenis = a.dataset.j;
    F.kat.value = ''; // ganti jenis -> reset pilihan kategori
    render();
  };
});

$('#fl').onsubmit = ev => {
  ev.preventDefault();
  render();
};

render();