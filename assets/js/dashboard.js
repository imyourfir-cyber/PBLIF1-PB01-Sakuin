/* 7. Dashboard */

// transaksi bulan ini
const bln = T.filter(t => t.tgl.startsWith(`${Y}-${M}`));

// total transaksi bulan ini per jenis ('Pemasukan' / 'Pengeluaran')
const total = j => jum(bln.filter(t => kat(t.kat).jenis === j), t => t.nom);

const [sal, tab] = saldo();

$('#hi').textContent = 'Selamat datang, ' + ME.nama.split(' ')[0];
$('#s-in').textContent = rp(total('Pemasukan'));
$('#s-out').textContent = rp(total('Pengeluaran'));
$('#s-sal').textContent = rp(sal);
$('#s-tab').textContent = 'Sudah dikurangi tabungan ' + rp(tab);

/* 8. Dashboard: peringatan anggaran */

// kartu peringatan untuk anggaran yang sudah terlewat
const warn = r => `
  <div class="glass pad warn">
    <b>Hey, udah dong!</b>
    ${r.nama ? 'Kategori ' + e(r.nama) : 'Pengeluaran bulan ini'}
    sudah lewat batas ${rp(r.batas)} (kelebihan ${rp(r.pakai - r.batas)}).
    <a href="anggaran.html" style="color:var(--gold)">Lihat anggaran</a>
  </div>`;

$('#warns').innerHTML = anggaran()
  .filter(r => r.pakai > r.batas)
  .map(warn)
  .join('');

/* 9. Dashboard: grafik garis */

// total per tanggal & jenis: { '2026-10-01': { Pemasukan: 100, Pengeluaran: 50 } }
const g = {};

bln.forEach(t => {
  const j = kat(t.kat).jenis;
  g[t.tgl] ??= {};
  g[t.tgl][j] = (g[t.tgl][j] || 0) + t.nom;
});

const ks = Object.keys(g).sort();                                   // tanggal berurutan
const mx = Math.max(1, ...ks.flatMap(k => Object.values(g[k])));    // nilai tertinggi

// area gambar di dalam viewBox 600x190
const X0 = 18, X1 = 582, Y0 = 172, TINGGI = 154;

// titik polyline untuk satu jenis
const garis = j => ks.map((k, i) => {
  const x = Math.round(X0 + i * (X1 - X0) / Math.max(ks.length - 1, 1));
  const y = Math.round(Y0 - (g[k][j] || 0) / mx * TINGGI);
  return x + ',' + y;
}).join(' ');

function grafik() {
  if (!ks.length) return '<div class="empty">Belum ada transaksi bulan ini.</div>';

  return `
    <svg viewBox="0 0 600 190" width="100%">
      <defs>
        <linearGradient id="gg" x1="0" x2="1">
          <stop offset="0" stop-color="#f8e6ae"/>
          <stop offset="1" stop-color="#e6bd62"/>
        </linearGradient>
      </defs>
      <line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" stroke="#fff3"/>
      <polyline points="${garis('Pemasukan')}" fill="none" stroke="url(#gg)"
        stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="${garis('Pengeluaran')}" fill="none" style="stroke:var(--in)"
        stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>
    </svg>
    <div class="leg">
      <span><i style="background:var(--gold)"></i>Pemasukan (garis tebal)</span>
      <span><i style="background:var(--in)"></i>Pengeluaran (garis putus)</span>
    </div>`;
}

$('#chart').innerHTML = grafik();

/* 10. Dashboard: transaksi terbaru */

// satu baris transaksi
const baris = t => {
  const k = kat(t.kat);
  const masuk = k.jenis === 'Pemasukan';

  return `
    <div class="li">
      <div>${e(k.nama)}<small>${e(t.ket || '-')}</small></div>
      <b class="${masuk ? 'cin' : 'cout'}">${masuk ? '+' : '-'} ${rp(t.nom)}</b>
    </div>`;
};

// 5 transaksi terbaru (tanggal terbaru dulu, lalu id terbesar)
$('#baru').innerHTML = [...T]
  .sort((a, b) => b.tgl.localeCompare(a.tgl) || b.id - a.id)
  .slice(0, 5)
  .map(baris)
  .join('') || '<div class="empty">Belum ada transaksi.</div>';