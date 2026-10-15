$('#jd').textContent='Batas Pengeluaran – '+['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][NOW.getMonth()]+' '+Y;
$('#ko').innerHTML='<option value="">Semua pengeluaran (total bulanan)</option>'+K.filter(k=>k.jenis==='Pengeluaran').map(k=>`<option value="${k.id}">${e(k.nama)}</option>`).join('');
$('#gr').innerHTML=anggaran().map(r=>{const p=r.pakai/r.batas*100,c=p>100?'hot':p>=80?'mid':'';
 return `<div class="glass item ${p>100?'warn':''}"><div class="hd"><b>${r.nama?e(r.nama):'Total pengeluaran bulanan'}</b><small>${Math.round(p)}%</small></div>
 <div class="prog"><i class="${c}" style="width:${Math.min(100,p)}%"></i></div>
 <div class="ft"><span>${rp(r.pakai)} <small>dari ${rp(r.batas)}</small></span>${p>100?`<b class="cout">Lewat ${rp(r.pakai-r.batas)}</b>`:`<small>Sisa ${rp(r.batas-r.pakai)}</small>`}</div>
 <div class="ft"><span></span><span><button type="button" class="btn sm" onclick="openM('m-ang',this)" data-d="${dj({kategori:r.kat??'',batas:r.batas})}">Edit</button> <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button></span></div></div>`}).join('')||'<div class="glass pad empty" style="grid-column:1/-1">Belum ada batas. Klik "+ Atur Batas" untuk membuat batas total bulanan atau per kategori.</div>';
