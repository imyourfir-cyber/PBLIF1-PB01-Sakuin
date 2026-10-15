// DATA DUMMY (frontend saja, tidak ada database)
const NOW=new Date(),Y=NOW.getFullYear(),M=String(NOW.getMonth()+1).padStart(2,'0');
const D=n=>`${Y}-${M}-${String(n).padStart(2,'0')}`, TODAY=D(NOW.getDate());
// ===== Akun (disimpan di localStorage browser; ini DEMO tanpa backend) =====
const SEED=[{nama:'Andi Pratama',username:'andi',email:'andi@email.com',nim:'2301234',password:'123456'}];
const USERS=()=>{try{const u=JSON.parse(localStorage.sk_users);if(Array.isArray(u)&&u.length)return u}catch(_){}return SEED.map(x=>({...x}))};
const SAVE=u=>{try{localStorage.sk_users=JSON.stringify(u);return true}catch(_){return false}};
const REQS=()=>{try{return JSON.parse(localStorage.sk_reset)||[]}catch(_){return[]}};
const SAVEREQ=r=>{localStorage.sk_reset=JSON.stringify(r)};
const ADMINS=['imyourfir@gmail.com','ghizellarahmaazzahra@gmail.com'], KODE_ADMIN='sakuin-admin';
// ME = akun yang sedang login (nama di topbar & sapaan dashboard mengikuti ini)
const ME=Object.assign({nama:'',username:'',email:'',nim:''},USERS().find(u=>u.username===localStorage.sk_session));
ME.foto=ME.foto||'../assets/img/user_1.jpg';
function simpanMe(){const u=USERS(),i=u.findIndex(x=>x.username===ME.username);if(i>-1){Object.assign(u[i],{nama:ME.nama,email:ME.email,nim:ME.nim,foto:ME.foto});SAVE(u)}}
const K=[{id:1,nama:'Uang Saku',jenis:'Pemasukan'},{id:2,nama:'Beasiswa',jenis:'Pemasukan'},{id:3,nama:'Makan',jenis:'Pengeluaran'},{id:4,nama:'Transportasi',jenis:'Pengeluaran'},{id:5,nama:'Hiburan',jenis:'Pengeluaran'}];
const T=[{id:1,tgl:D(1),kat:1,nom:1500000,ket:'Kiriman bulanan'},{id:2,tgl:D(3),kat:2,nom:2000000,ket:'Beasiswa semester ganjil'},{id:3,tgl:D(2),kat:3,nom:45000,ket:'Makan siang kantin'},{id:4,tgl:D(4),kat:4,nom:30000,ket:'Ojek online ke kampus'},{id:5,tgl:D(6),kat:3,nom:120000,ket:'Makan bareng teman'},{id:6,tgl:D(7),kat:5,nom:75000,ket:'Nonton bioskop'},{id:7,tgl:D(9),kat:3,nom:85000,ket:'Belanja bahan makanan'},{id:8,tgl:D(10),kat:4,nom:50000,ket:'Isi bensin'},{id:9,tgl:D(12),kat:3,nom:90000,ket:'Makan malam'}];
const A=[{id:1,kat:null,batas:2000000},{id:2,kat:3,batas:300000},{id:3,kat:5,batas:150000}];
const TB=[{id:1,nama:'Laptop baru',target:8000000},{id:2,nama:'Dana darurat',target:2000000}];
const S=[{tgl:D(5),tb:1,nom:500000},{tgl:D(8),tb:1,nom:300000},{tgl:D(11),tb:2,nom:200000}];
const BLN=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const rp=n=>'Rp '+Math.round(n).toLocaleString('id-ID');
const tgl=s=>{const [y,m,d]=s.split('-');return +d+' '+BLN[m-1]+' '+y};
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dj=x=>e(JSON.stringify(x));
const kat=id=>K.find(k=>k.id==id);
const jum=(arr,f)=>arr.reduce((a,x)=>a+f(x),0);
const terkumpul=id=>jum(S.filter(s=>s.tb==id),s=>s.nom);
function saldo(){const i=jum(T.filter(t=>kat(t.kat).jenis==='Pemasukan'),t=>t.nom),o=jum(T.filter(t=>kat(t.kat).jenis==='Pengeluaran'),t=>t.nom),tab=jum(S,s=>s.nom);return [i-o-tab,tab]}
function anggaran(){return A.map(a=>({...a,nama:a.kat?kat(a.kat).nama:null,pakai:jum(T.filter(t=>kat(t.kat).jenis==='Pengeluaran'&&(!a.kat||t.kat==a.kat)),t=>t.nom)}))}
