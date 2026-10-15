const [sisa,total]=saldo(); $('#s-tot').textContent=rp(total); $('#s-sal').textContent=rp(sisa);
$('#gr').innerHTML=[...TB].reverse().map(r=>{const tk=terkumpul(r.id),p=Math.min(100,tk/r.target*100);
 return `<div class="glass item"><div class="hd"><b>${e(r.nama)}</b><small>${Math.round(p)}%${p>=100?' · Tercapai':''}</small></div>
 <div class="prog"><i class="${p>=100?'mid':''}" style="width:${p}%"></i></div>
 <div class="ft"><span>${rp(tk)} <small>dari ${rp(r.target)}</small></span><small>Kurang ${rp(Math.max(0,r.target-tk))}</small></div>
 <div class="ft"><button type="button" class="btn gold sm" onclick="openM('m-setor',this)" data-d="${dj({id:r.id,nama:r.nama,tanggal:TODAY})}">Nabung</button><span>
 <button type="button" class="btn sm" onclick="openM('m-tgt',this)" data-d="${dj({id:r.id,nama:r.nama,target:r.target})}">Edit</button> <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button></span></div></div>`}).join('')||'<div class="glass pad empty" style="grid-column:1/-1">Belum ada target tabungan. Buat satu, misalnya "Laptop baru" atau "Dana darurat".</div>';
