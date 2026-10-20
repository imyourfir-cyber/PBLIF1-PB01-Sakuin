/* ---------- Ringkasan ---------- */

const [sisa, total] = saldo();
$('#s-tot').textContent = rp(total);
$('#s-sal').textContent = rp(sisa);

/* ---------- Kartu target ---------- */

function kartuHtml(r) {
  const terkumpulRp = terkumpul(r.id);
  const persen = Math.min(100, (terkumpulRp / r.target) * 100);
  const tercapai = persen >= 100;
  const kurang = Math.max(0, r.target - terkumpulRp);

  const dataSetor = dj({ id: r.id, nama: r.nama, tanggal: TODAY });
  const dataEdit = dj({ id: r.id, nama: r.nama, target: r.target });

  return `
    <div class="glass item">
      <div class="hd">
        <b>${e(r.nama)}</b>
        <small>${Math.round(persen)}%${tercapai ? ' · Tercapai' : ''}</small>
      </div>

      <div class="prog">
        <i class="${tercapai ? 'mid' : ''}" style="width:${persen}%"></i>
      </div>

      <div class="ft">
        <span>${rp(terkumpulRp)} <small>dari ${rp(r.target)}</small></span>
        <small>Kurang ${rp(kurang)}</small>
      </div>

      <div class="ft">
        <button type="button" class="btn gold sm" onclick="openM('m-setor',this)" data-d="${dataSetor}">Nabung</button>
        <span>
          <button type="button" class="btn sm" onclick="openM('m-tgt',this)" data-d="${dataEdit}">Edit</button>
          <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button>
        </span>
      </div>
    </div>`;
}

const kosongHtml = `
  <div class="glass pad empty" style="grid-column: 1 / -1">
    Belum ada target tabungan. Buat satu, misalnya "Laptop baru" atau "Dana darurat".
  </div>`;

// terbaru dulu (salinan array, TB asli tidak diubah)
$('#gr').innerHTML = [...TB].reverse().map(kartuHtml).join('') || kosongHtml;