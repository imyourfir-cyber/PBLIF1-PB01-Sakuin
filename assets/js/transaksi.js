$('#kf').innerHTML='<option value="">Semua Kategori</option>'+K.map(k=>`<option value="${k.id}">${e(k.nama)}</option>`).join('');
$('#kopt').innerHTML=K.map(k=>`<option value="${k.id}" data-j="${k.jenis}">${e(k.nama)}</option>`).join('');
$('#add').onclick=function(){this.dataset.d=JSON.stringify({tanggal:TODAY});openM('m-trx',this)};
function render(){
  const f=$('#fl').elements,q=f.q.value.toLowerCase();
  const rows=T.filter(t=>{const k=kat(t.kat);return(!q||(t.ket+' '+k.nama).toLowerCase().includes(q))&&(!f.jenis.value||k.jenis===f.jenis.value)&&(!f.kategori.value||t.kat==f.kategori.value)&&(!f.dari.value||t.tgl>=f.dari.value)&&(!f.sampai.value||t.tgl<=f.sampai.value)}).sort((a,b)=>b.tgl.localeCompare(a.tgl)||b.id-a.id);
  $('#tb').innerHTML=rows.map((t,i)=>{const k=kat(t.kat),m=k.jenis==='Pemasukan';
    return `<tr><td>${i+1}</td><td>${tgl(t.tgl)}</td><td><span class="tag ${m?'i':'o'}">${k.jenis}</span></td><td>${e(k.nama)}</td><td class="n">${rp(t.nom)}</td><td>${e(t.ket||'-')}</td>
    <td class="n"><button type="button" class="btn sm" onclick="openM('m-trx',this)" data-d="${dj({id:t.id,tanggal:t.tgl,jenis:k.jenis,kategori:t.kat,nominal:t.nom,keterangan:t.ket})}">Edit</button>
    <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button></td></tr>`}).join('')||'<tr><td colspan="7" class="empty">Data tidak ditemukan.</td></tr>';
}
$('#fl').onsubmit=ev=>{ev.preventDefault();render()}; render();
