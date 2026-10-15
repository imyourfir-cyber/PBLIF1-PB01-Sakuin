const info=()=>[['Nama',ME.nama],['Username',ME.username],['Email',ME.email],['NIM (opsional)',ME.nim]].map(([l,v])=>`<div class="row"><span>${l}</span><b>${e(v||'-')}</b></div>`).join('');
$('#foto').style.backgroundImage=`url('${ME.foto}')`; $('#info').innerHTML=info(); $('#un').value=ME.username;
$('#ubah').onclick=function(){this.dataset.d=JSON.stringify({nama:ME.nama,email:ME.email,nim:ME.nim});openM('m-prof',this)};
$('#fp').onsubmit=ev=>{ev.preventDefault();const f=ev.target;Object.assign(ME,{nama:f.nama.value,email:f.email.value,nim:f.nim.value});simpanMe();$('#info').innerHTML=info();closeM();toast('Profil berhasil disimpan (demo).')};
$('#ff').onchange=function(){const f=this.files[0];if(!f)return;if(f.size>2097152)return toast('Foto maksimal 2 MB.',true);
  const r=new FileReader();r.onload=()=>{ME.foto=r.result;simpanMe();document.querySelectorAll('.av').forEach(a=>a.style.backgroundImage=`url('${r.result}')`);toast('Foto profil berhasil diubah (demo).')};r.readAsDataURL(f)};
