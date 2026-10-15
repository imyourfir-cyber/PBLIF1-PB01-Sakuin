let jenis=new URLSearchParams(location.search).get('jenis'); if(!['Pemasukan','Pengeluaran','Tabungan'].includes(jenis)) jenis='Pemasukan';
const F=$('#fl').elements, R=(x,a,b)=>(!a||x>=a)&&(!b||x<=b);
document.querySelectorAll('.seg a').forEach(a=>a.onclick=ev=>{ev.preventDefault();jenis=a.dataset.j;F.kat.value='';render()});
function render(){
  document.querySelectorAll('.seg a').forEach(a=>a.classList.toggle('on',a.dataset.j===jenis));
  const keep=F.kat.value, tab=jenis==='Tabungan', d=F.dari.value, s=F.sampai.value;
  $('#sel').innerHTML=tab?'<option value="">Semua Target</option>'+TB.map(k=>`<option value="${k.id}">${e(k.nama)}</option>`).join(''):'<option value="">Semua Kategori</option>'+K.filter(k=>k.jenis===jenis).map(k=>`<option value="${k.id}">${e(k.nama)}</option>`).join('');
  $('#sel').value=[...$('#sel').options].some(o=>o.value===keep)?keep:'';
  const kv=$('#sel').value, tr=T.filter(t=>R(t.tgl,d,s)), J=j=>jum(tr.filter(t=>kat(t.kat).jenis===j),t=>t.nom);
  if(tab){
    const rows=S.filter(x=>R(x.tgl,d,s)&&(!kv||x.tb==kv)).sort((a,b)=>a.tgl.localeCompare(b.tgl)), sum=jum(rows,x=>x.nom), [sisa,tot]=saldo();
    $('#out').innerHTML=`<div class="cards"><div class="glass stat"><small>Total Disetor (periode ini)</small><b class="cin">${rp(sum)}</b></div><div class="glass stat"><small>Total Tabungan (keseluruhan)</small><b>${rp(tot)}</b></div><div class="glass stat sal"><small>Saldo Tersedia</small><b>${rp(sisa)}</b></div></div>
    <div class="glass pad"><h3 style="margin-bottom:10px">Progres per Target</h3><div class="tw"><table><thead><tr><th>No</th><th>Target</th><th class="n">Terkumpul</th><th class="n">Target</th><th class="n">Progres</th></tr></thead><tbody>${TB.map((r,i)=>`<tr><td>${i+1}</td><td>${e(r.nama)}</td><td class="n">${rp(terkumpul(r.id))}</td><td class="n">${rp(r.target)}</td><td class="n">${Math.min(100,Math.round(terkumpul(r.id)/r.target*100))}%</td></tr>`).join('')}</tbody></table></div></div>
    <div class="glass pad"><h3 style="margin-bottom:10px">Rekap Tabungan</h3><div class="tw"><table><thead><tr><th>No</th><th>Tanggal</th><th>Target</th><th class="n">Nominal</th></tr></thead><tbody>${rows.map((x,i)=>`<tr><td>${i+1}</td><td>${tgl(x.tgl)}</td><td>${e(TB.find(t=>t.id==x.tb).nama)}</td><td class="n">${rp(x.nom)}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">Data tidak ditemukan.</td></tr>'}</tbody><tfoot><tr><td colspan="3" class="n">Total</td><td class="n">${rp(sum)}</td></tr></tfoot></table></div></div>`;
  } else {
    const rows=tr.filter(t=>kat(t.kat).jenis===jenis&&(!kv||t.kat==kv)).sort((a,b)=>a.tgl.localeCompare(b.tgl)||a.id-b.id), sum=jum(rows,t=>t.nom);
    $('#out').innerHTML=`<div class="cards"><div class="glass stat"><small>Total Pemasukan</small><b class="cin">${rp(J('Pemasukan'))}</b></div><div class="glass stat"><small>Total Pengeluaran</small><b class="cout">${rp(J('Pengeluaran'))}</b></div><div class="glass stat sal"><small>Saldo</small><b>${rp(J('Pemasukan')-J('Pengeluaran'))}</b></div></div>
    <div class="glass pad"><h3 style="margin-bottom:10px">Rekap ${jenis}</h3><div class="tw"><table><thead><tr><th>No</th><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th class="n">Nominal</th></tr></thead><tbody>${rows.map((t,i)=>`<tr><td>${i+1}</td><td>${tgl(t.tgl)}</td><td>${e(kat(t.kat).nama)}</td><td>${e(t.ket||'-')}</td><td class="n">${rp(t.nom)}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">Data tidak ditemukan.</td></tr>'}</tbody><tfoot><tr><td colspan="4" class="n">Total</td><td class="n">${rp(sum)}</td></tr></tfoot></table></div></div>`;
  }
}
$('#fl').onsubmit=ev=>{ev.preventDefault();render()}; render();
