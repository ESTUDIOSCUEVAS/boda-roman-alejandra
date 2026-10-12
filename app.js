(() => {
'use strict';
const config=window.WEDDING, $=id=>document.getElementById(id);
// Entrada mediante el sobre: el contenido permanece disponible si JavaScript no carga.
const opening=$('opening'), invitation=$('invitation');
opening.hidden=false;invitation.hidden=true;
$('open-invitation').addEventListener('click',()=>{
 $('open-invitation').disabled=true;opening.classList.add('is-open');
 const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:800;
 setTimeout(()=>{opening.hidden=true;invitation.hidden=false;window.scrollTo(0,0);$('music-title').focus({preventScroll:true});$('floating-music').hidden=!config.song;},delay);
},{once:true});
$('confirmation').hidden=true;$('show-rsvp').hidden=false;
$('show-rsvp').addEventListener('click',()=>{
 $('confirmation').hidden=false;$('show-rsvp').setAttribute('aria-expanded','true');
 $('show-rsvp').textContent='Formulario de confirmación';
 $('confirmation').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});document.querySelector('[name=attendance]:checked').focus({preventScroll:true});
});

const params=new URLSearchParams(location.search), id=params.get('id')||'';
const demo=!config.endpoint;
let guest=null;
const itineraryIcons = {
  guests: '<circle cx="8" cy="7" r="3"/><circle cx="18" cy="8" r="2.5"/><path d="M2 21v-3a6 6 0 0 1 12 0v3M15 14a5 5 0 0 1 7 4v3"/>',
  couple: '<path d="M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13Z"/>',
  rings: '<circle cx="8" cy="15" r="6"/><circle cx="16" cy="15" r="6"/><path d="m5 5 3-3 3 3-3 4ZM13 5l3-3 3 3-3 4Z"/>',
  toast: '<path d="m3 3 7 2-2 7a3.7 3.7 0 0 1-7-2ZM14 5l7-2 2 7a3.7 3.7 0 0 1-7 2ZM5 14l-2 7M1 20l5 2M19 14l2 7M18 22l5-2M11 1l1 3M15 1l-1 3"/>',
  dance: '<path d="M9 17V5l11-3v13M9 8l11-3"/><ellipse cx="6" cy="18" rx="3" ry="2.5"/><ellipse cx="17" cy="16" rx="3" ry="2.5"/>',
  dinner: '<path d="M5 2v7M2 2v5a3 3 0 0 0 6 0V2M5 10v12M19 2c-4 4-4 8 0 10h2V2ZM21 12v10"/>',
  dessert: '<path d="M3 11h18v11H3ZM3 15q3 4 6 0 3 4 6 0 3 4 6 0M6 11V7h12v4M12 7V4"/><path d="M12 4c-3-1-1-3 0-4 1 1 3 3 0 4Z"/>',
  camera: '<path d="M2 7h5l2-3h6l2 3h5v14H2Z"/><circle cx="12" cy="14" r="4"/><path d="M18 10h1"/>',
  bouquet: '<path d="m8 14 2 8h4l2-8M6 11c-3-4 0-7 4-4-1-5 4-7 5-2 4-3 7 1 3 4 5 1 5 6 0 6M8 14l8 2M10 18l4 1"/><circle cx="12" cy="11" r="3"/>',
  end: '<path d="M19 3a9 9 0 1 0 2 15A10 10 0 0 1 19 3ZM5 3v4M3 5h4"/>'
};
const activities = [
 ['05:00 PM','Llegada de los invitados','guests'],
 ['05:30 PM','Llegada de los novios','couple'],
 ['05:40 PM','Ceremonia','rings'],
 ['06:40 PM','Brindis y felicitaciones','toast'],
 ['06:55 PM','Baile de los novios','dance'],
 ['07:40 PM','Cena','dinner'],
 ['08:50 PM','Postres','dessert'],
 ['09:10 PM','Fotografías','camera'],
 ['09:40 PM','Lanzamiento de ramo y juegos','bouquet'],
 ['10:30 PM','Fin del evento','end']
];
activities.forEach(([time, activity, icon]) => {
 const li=document.createElement('li');
 const t=document.createElement('time');t.textContent=time;
 const dot=document.createElement('span');dot.className='dot';dot.setAttribute('aria-hidden','true');
 dot.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">'+itineraryIcons[icon]+'</svg>';
 const text=document.createElement('span');text.textContent=activity;
 li.append(t,dot,text);$('timeline').append(li);
});
const photoDescriptions=['Román y Alejandra abrazados en el jardín','Román y Alejandra tomados de la mano','Román y Alejandra juntos bajo el mirador','Román y Alejandra al atardecer'];
document.querySelectorAll('[data-photo]').forEach(el=>{
 const index=Number(el.dataset.photo), src=config.photos[index];if(!src)return;
 const visual=document.createElement('div');visual.className='photo-visual';
 const img=document.createElement('img');img.src=src;img.alt=photoDescriptions[index];img.decoding='async';
 if(index===0)img.fetchPriority='high';else img.loading='lazy';
 visual.append(img);el.prepend(visual);el.classList.add('has-photo');
});
$('maps').href=config.maps||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Salón de eventos 7 tesoros, Veracruz y Francisco Javier Mina, Los Olivos, Ciudad Constitución, Baja California Sur, México');if(config.maps)$('map-note').hidden=true;
function count(){let n=Math.max(0,Math.floor((new Date(config.date)-Date.now())/1000));const values=[Math.floor(n/86400),Math.floor(n/3600)%24,Math.floor(n/60)%60,n%60];['days','hours','minutes','seconds'].forEach((key,i)=>$(key).textContent=String(values[i]).padStart(2,'0'));if(n===0)$('date-status').textContent='¡Llegó nuestro gran día!'}count();setInterval(count,1000);
const audio=$('audio');if(config.song)audio.src=config.song;
const progress=$('music-progress');
const formatTime=t=>{t=Number.isFinite(t)?Math.max(0,Math.floor(t)):0;return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
function musicUI(){
 const playing=!audio.paused;
 $('song-icon').textContent=playing?'Ⅱ':'▷';
 $('song').setAttribute('aria-label',playing?'Pausar nuestra canción':'Reproducir nuestra canción');
 $('song').setAttribute('aria-pressed',String(playing));
 $('floating-music').textContent=playing?'Ⅱ':'▷';
 $('floating-music').setAttribute('aria-label',playing?'Pausar música':'Reproducir música');
 $('floating-music').setAttribute('aria-pressed',String(playing));
 $('song-label').textContent=playing?'Nuestra canción, contigo':'Dale play y acompáñanos';
 $('music-start').classList.toggle('is-playing',playing);
}
function updateProgress(){
 $('music-current').textContent=formatTime(audio.currentTime);
 if(Number.isFinite(audio.duration)&&audio.duration>0){
  progress.max=audio.duration;progress.disabled=false;$('music-duration').textContent=formatTime(audio.duration);
  progress.value=audio.currentTime;progress.style.setProperty('--progress',(100*audio.currentTime/audio.duration)+'%');
 }
 progress.setAttribute('aria-valuetext',formatTime(audio.currentTime)+' de '+formatTime(audio.duration));
}
progress.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(progress.value);updateProgress();});
async function toggle(){
 if(!config.song){$('music-status').textContent='Nuestra canción estará disponible próximamente.';return;}
 try{if(audio.paused)await audio.play();else audio.pause();$('music-status').textContent='';$('floating-music').hidden=false;}
 catch(e){$('music-status').textContent='No se pudo reproducir la canción. Toca play para intentar de nuevo.';}
}
['play','pause','ended'].forEach(event=>audio.addEventListener(event,musicUI));
['loadedmetadata','durationchange','timeupdate'].forEach(event=>audio.addEventListener(event,updateProgress));
audio.addEventListener('error',()=>{$('music-status').textContent='No se pudo cargar la canción. Intenta de nuevo.';});
$('song').onclick=toggle;$('floating-music').onclick=toggle;
function options(){const yes=document.querySelector('[name=attendance]:checked').value==='yes';$('people').replaceChildren();for(let n=yes?1:0;n<=(yes?(guest?.passes||1):0);n++){const op=document.createElement('option');op.value=n;op.textContent=n+' '+(n===1?'persona':'personas');$('people').append(op)}$('people').disabled=!yes;}
function setGuest(g){guest=g;$('guest-name').textContent=g.name;$('rsvp-guest').textContent=g.name;$('pass-count').textContent='Pase para '+g.passes+' '+(g.passes===1?'persona':'personas');options();$('submit').disabled=false;}
document.querySelectorAll('[name=attendance]').forEach(el=>el.onchange=options);options();
async function request(url,init){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);try{const res=await fetch(url,{...init,signal:controller.signal});if(!res.ok)throw Error('No pudimos conectar. Intenta de nuevo.');const data=await res.json();if(!data.ok)throw Error(data.message||'No pudimos procesar la invitación.');return data}finally{clearTimeout(timer)}}
async function loadGuest(){if(demo){const raw=Number(params.get('pases')||2), passes=Number.isInteger(raw)&&raw>=1&&raw<=20?raw:2;setGuest({name:(params.get('invitado')||'Invitado de ejemplo').slice(0,120),passes});$('rsvp-info').textContent='Vista de prueba. Las respuestas todavía no se guardan.';$('submit').textContent='Probar confirmación';return}
$('submit').disabled=true;if(!id){$('rsvp-info').textContent='Para confirmar, abre el enlace personal que te compartieron los novios.';return}try{$('rsvp-info').textContent='Consultando tu invitación…';const data=await request(config.endpoint+'?'+new URLSearchParams({action:'guest',id}));if(!Number.isInteger(data.guest.passes)||data.guest.passes<1||data.guest.passes>20)throw Error('El pase no es válido.');setGuest(data.guest);$('rsvp-info').textContent=''}catch(e){$('rsvp-info').textContent=e.name==='AbortError'?'La consulta tardó demasiado. Recarga para intentar de nuevo.':e.message}}
loadGuest();
$('confirmation').addEventListener('submit', async e => {
 e.preventDefault();
 const attendance = document.querySelector('[name=attendance]:checked').value;
 const people = attendance === 'no' ? 0 : Number($('people').value);
 const name = String(guest?.name || '').trim();
 const wishes = $('wishes').value.trim();
 const whatsapp = $('whatsapp-confirmation');
 whatsapp.hidden = true;
 if (!guest || !name || !Number.isInteger(people) || people < 0 || people > guest.passes || (attendance === 'yes' && people < 1)) {
  $('form-status').textContent = 'Revisa tu invitación y el número de personas.';
  return;
 }
 if (demo) {
  $('form-status').textContent = 'Prueba completada. No se guardó una respuesta ni se abrió WhatsApp.';
  return;
 }
 $('submit').disabled = true;
 $('form-status').textContent = 'Guardando tu respuesta…';
 try {
  await request(config.endpoint, {
   method: 'POST',
   body: new URLSearchParams({id, name, attendance, people: String(people), wishes})
  });
 } catch (err) {
  $('form-status').textContent = 'No pudimos verificar el guardado. Intenta de nuevo; tu respuesta se actualizará sin duplicarse.';
  $('submit').disabled = false;
  return;
 }
 // WhatsApp se ofrece únicamente después del guardado confirmado en Sheets.
 const message = [
  'Confirmación — Boda de Román y Alejandra',
  'Invitación: ' + name,
  'Asistencia: ' + (attendance === 'yes' ? 'Sí' : 'No'),
  'Personas confirmadas: ' + people,
  ...(wishes ? ['Deseos para los novios: ' + wishes] : []),
  attendance === 'yes' ? '¡Nos vemos el 13 de noviembre!' : 'Gracias por invitarnos.'
 ].join('\n');
 const url = 'https://wa.me/526131113639?text=' + encodeURIComponent(message);
 whatsapp.href = url;
 whatsapp.hidden = false;
 $('form-status').textContent = 'Tu respuesta quedó registrada. Envía el mensaje en WhatsApp; si no se abre, toca el botón de abajo.';
 $('submit').textContent = 'Actualizar y abrir WhatsApp';
 $('submit').disabled = false;
 try { window.location.assign(url); } catch (err) { /* El enlace permanece disponible. */ }
});
if('IntersectionObserver' in window){document.documentElement.classList.add('motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
})();
