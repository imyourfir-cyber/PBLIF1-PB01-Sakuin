const bln=T.filter(t=>t.tgl.startsWith(`${Y}-${M}`)), J=j=>jum(bln.filter(t=>kat(t.kat).jenis===j),t=>t.nom);
const [sal,tab]=saldo();
$('#hi').textContent='Selamat datang, '+ME.nama.split(' ')[0];
$('#s-in').textContent=rp(J('Pemasukan')); $('#s-out').textContent=rp(J('Pengeluaran')); $('#s-sal').textContent=rp(sal); $('#s-tab').textContent='Sudah dikurangi tabungan '+rp(tab);
$('#warns').innerHTML=anggaran().filter(r=>r.pakai>r.batas).map(r=>`<div class="glass pad warn"><b>Hey, udah dong!</b> ${r.nama?'Kategori '+e(r.nama):'Pengeluaran bulan ini'} sudah lewat batas ${rp(r.batas)} (kelebihan ${rp(r.pakai-r.batas)}). <a href="anggaran.html" style="color:var(--gold)">Lihat anggaran</a></div>`).join('');
// grafik garis
const g={}; bln.forEach(t=>{(g[t.tgl]??={})[kat(t.kat).jenis]=(g[t.tgl][kat(t.kat).jenis]||0)+t.nom});
const ks=Object.keys(g).sort(), mx=Math.max(1,...ks.flatMap(k=>Object.values(g[k])));
const garis=j=>ks.map((k,i)=>Math.round(18+i*564/Math.max(ks.length-1,1))+','+Math.round(172-(g[k][j]||0)/mx*154)).join(' ');
$('#chart').innerHTML=ks.length?`<svg viewBox="0 0 600 190" width="100%"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#f8e6ae"/><stop offset="1" stop-color="#e6bd62"/></linearGradient></defs><line x1="18" y1="172" x2="582" y2="172" stroke="#fff3"/><polyline points="${garis('Pemasukan')}" fill="none" stroke="url(#gg)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${garis('Pengeluaran')}" fill="none" style="stroke:var(--in)" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/></svg><div class="leg"><span><i style="background:var(--gold)"></i>Pemasukan (garis tebal)</span><span><i style="background:var(--in)"></i>Pengeluaran (garis putus)</span></div>`:'<div class="empty">Belum ada transaksi bulan ini.</div>';
$('#baru').innerHTML=[...T].sort((a,b)=>b.tgl.localeCompare(a.tgl)||b.id-a.id).slice(0,5).map(t=>{const m=kat(t.kat).jenis==='Pemasukan';return `<div class="li"><div>${e(kat(t.kat).nama)}<small>${e(t.ket||'-')}</small></div><b class="${m?'cin':'cout'}">${m?'+':'-'} ${rp(t.nom)}</b></div>`}).join('')||'<div class="empty">Belum ada transaksi.</div>';
