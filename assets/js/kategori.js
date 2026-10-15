let jenis='Pemasukan';
document.querySelectorAll('.seg a').forEach(a=>a.onclick=ev=>{ev.preventDefault();jenis=a.dataset.j;document.querySelectorAll('.seg a').forEach(x=>x.classList.toggle('on',x===a));render()});
$('#add').onclick=function(){this.dataset.d=JSON.stringify({jenis});openM('m-kat',this)};
function render(){
  const q=$('#fl').q.value.toLowerCase();
  $('#tb').innerHTML=K.filter(k=>k.jenis===jenis&&k.nama.toLowerCase().includes(q)).map((k,i)=>
   `<tr><td>${i+1}</td><td>${e(k.nama)}</td><td class="n">${rp(jum(T.filter(t=>t.kat==k.id),t=>t.nom))}</td><td class="n"><button type="button" class="btn sm" onclick="openM('m-kat',this)" data-d="${dj({id:k.id,nama:k.nama,jenis:k.jenis})}">Edit</button> <button type="button" class="btn sm dng" onclick="hapus(this)">Hapus</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">Data tidak ditemukan.</td></tr>';
}
$('#fl').onsubmit=ev=>{ev.preventDefault();render()}; render();
