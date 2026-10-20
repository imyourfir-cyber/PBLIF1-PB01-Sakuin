/* 20. Anggaran: judul & pilihan kategori */

// nama bulan lengkap (BLN di file data hanya singkatan)
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

$('#jd').textContent = 'Batas Pengeluaran – ' + BULAN[NOW.getMonth()] + ' ' + Y;

// pilihan kategori di form: total bulanan + semua kategori pengeluaran
$('#ko').innerHTML =
  '<option value="">Semua pengeluaran (total bulanan)</option>' +
  K.filter(k => k.jenis === 'Pengeluaran')
    .map(k => `<option value="${k.id}">${e(k.nama)}</option>`)
    .join('');

/* 21. Anggaran: daftar batas */

// satu kartu anggaran; warna bar: merah > 100%, kuning >= 80%
const kartu = r => {
  const p = r.pakai / r.batas * 100;
  const c = p > 100 ? 'hot' : p >= 80 ? 'mid' : '';
  const lewat = p > 100;

  return `
    <div class="glass item ${lewat ? 'warn' : ''}">
      <div class="hd">
        <b>${r.nama ? e(r.nama) : 'Total pengeluaran bulanan'}</b>
        <small>${Math.round(p)}%</small>
      </div>
      <div class="prog"><i class="${c}" style="width:${Math.min(100, p)}%"></i></div>
      <div class="ft">
        <span>${rp(r.pakai)} <small>dari ${rp(r.batas)}</small></span>
        ${lewat
          ? `<b class="cout">Lewat ${rp(r.pakai - r.batas)}</b>`
          : `<small>Sisa ${rp(r.batas - r.pakai)}</small>`}
      </div>
      <div class="ft">
        <span></span>
        <span>
          <button type="button" class="btn sm" onclick="openM('m-ang',this)"
            data-d="${dj({ kategori: r.kat ?? '', batas: r.batas })}">Edit</button>
          <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button>
        </span>
      </div>
    </div>`;
};

$('#gr').innerHTML = anggaran().map(kartu).join('') || `
  <div class="glass pad empty" style="grid-column:1/-1">
    Belum ada batas. Klik "+ Atur Batas" untuk membuat batas total bulanan atau per kategori.
  </div>`;