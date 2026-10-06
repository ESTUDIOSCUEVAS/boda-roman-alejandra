(() => {
'use strict';
const config=window.WEDDING, $=id=>document.getElementById(id);
// Entrada mediante el sobre: el contenido permanece disponible si JavaScript no carga.
const opening=$('opening'), invitation=$('invitation');
opening.hidden=false;invitation.hidden=true;
$('open-invitation').addEventListener('click',()=>{
 $('open-invitation').disabled=true;opening.classList.add('is-open');
 const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:800;
 setTimeout(()=>{opening.hidden=true;invitation.hidden=false;window.scrollTo(0,0);$('couple-title').focus({preventScroll:true});},delay);
},{once:true});
$('confirmation').hidden=true;$('show-rsvp').hidden=false;
$('show-rsvp').addEventListener('click',()=>{
 $('confirmation').hidden=false;$('show-rsvp').setAttribute('aria-expanded','true');
 $('show-rsvp').textContent='Formulario de confirmación';
 $('confirmation').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});$('name').focus({preventScroll:true});
});

const params=new URLSearchParams(location.search), id=params.get('id')||'';
const demo=!config.endpoint;
let guest=null;
const activities=[['05:00 PM','Llegada de los invitados','◇'],['05:30 PM','Llegada de los novios','♡'],['05:40 PM','Ceremonia','○'],['06:40 PM','Brindis y felicitaciones','◇'],['06:55 PM','Baile de los novios','♡'],['07:40 PM','Cena','◇'],['08:50 PM','Postres','○'],['09:10 PM','Fotografías','◇'],['09:40 PM','Lanzamiento de ramo y juegos','♡'],['10:30 PM','Fin del evento','○']];
activities.forEach(([time,activity,icon])=>{const li=document.createElement('li');const t=document.createElement('time');t.textContent=time;const dot=document.createElement('span');dot.className='dot';dot.setAttribute('aria-hidden','true');dot.textContent=icon;const text=document.createElement('span');text.textContent=activity;li.append(t,dot,text);$('timeline').append(li)});
document.querySelectorAll('[data-photo]').forEach(el=>{const src=config.photos[Number(el.dataset.photo)];if(!src)return;const img=new Image();img.onload=()=>{el.style.backgroundImage=`url(${JSON.stringify(new URL(src,location.href).href)})`;el.classList.add('has-photo')};img.src=src});
$('maps').href=config.maps||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Salón de eventos 7 tesoros, Veracruz y Francisco Javier Mina, Los Olivos, Ciudad Constitución, Baja California Sur, México');if(config.maps)$('map-note').hidden=true;
function count(){let n=Math.max(0,Math.floor((new Date(config.date)-Date.now())/1000));const values=[Math.floor(n/86400),Math.floor(n/3600)%24,Math.floor(n/60)%60,n%60];['days','hours','minutes','seconds'].forEach((key,i)=>$(key).textContent=String(values[i]).padStart(2,'0'));if(n===0)$('date-status').textContent='¡Llegó nuestro gran día!'}count();setInterval(count,1000);
const audio=$('audio');if(config.song)audio.src=config.song;
function musicUI(){const playing=!audio.paused;$('song').innerHTML=`<span class="play-icon">${playing?'Ⅱ':'▷'}</span> ${playing?'Pausa nuestra canción':'Reproduce nuestra canción'}`;$('floating-music').textContent=playing?'Ⅱ':'▷';$('floating-music').setAttribute('aria-label',playing?'Pausar música':'Reproducir música');}
function showSpotify(){
 const box=$('spotify-player');
 if(!box.querySelector('iframe')){
  const frame=document.createElement('iframe');
  frame.src='https://open.spotify.com/embed/track/'+encodeURIComponent(config.spotifyTrack)+'?utm_source=generator';
  frame.title='Spotify: '+(config.songTitle||'Nuestra canción');frame.width='100%';frame.height='152';
  frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  frame.allowFullscreen=true;
  const link=document.createElement('a');link.href='https://open.spotify.com/track/'+encodeURIComponent(config.spotifyTrack);
  link.target='_blank';link.rel='noopener';link.textContent='Escuchar en Spotify';box.append(frame,link);
 }
 box.hidden=false;$('music-status').textContent=config.songTitle||'Nuestra canción';
 $('song').innerHTML='<span class="play-icon">♫</span> Nuestra canción';
 $('floating-music').hidden=false;$('floating-music').textContent='♫';$('floating-music').setAttribute('aria-label','Ver el reproductor de nuestra canción');
 box.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
async function toggle(){if(!config.song){if(config.spotifyTrack){showSpotify();return}$('music-status').textContent='Nuestra canción estará disponible próximamente.';return}try{if(audio.paused)await audio.play();else audio.pause();$('music-status').textContent='';$('floating-music').hidden=false}catch(e){$('music-status').textContent='No se pudo reproducir la canción. Intenta de nuevo.'}}
audio.addEventListener('play',musicUI);audio.addEventListener('pause',musicUI);audio.addEventListener('error',()=>{$('music-status').textContent='No se pudo cargar la canción.';});$('song').onclick=toggle;$('floating-music').onclick=toggle;
function options(){const yes=document.querySelector('[name=attendance]:checked').value==='yes';$('people').replaceChildren();for(let n=yes?1:0;n<=(yes?(guest?.passes||1):0);n++){const op=document.createElement('option');op.value=n;op.textContent=n+' '+(n===1?'persona':'personas');$('people').append(op)}$('people').disabled=!yes;}
function setGuest(g){guest=g;$('guest-name').textContent=g.name;$('name').value=g.name;$('pass-count').textContent='Pase para '+g.passes+' '+(g.passes===1?'persona':'personas');options();$('submit').disabled=false;}
document.querySelectorAll('[name=attendance]').forEach(el=>el.onchange=options);options();
async function request(url,init){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);try{const res=await fetch(url,{...init,signal:controller.signal});if(!res.ok)throw Error('No pudimos conectar. Intenta de nuevo.');const data=await res.json();if(!data.ok)throw Error(data.message||'No pudimos procesar la invitación.');return data}finally{clearTimeout(timer)}}
async function loadGuest(){if(demo){const raw=Number(params.get('pases')||2), passes=Number.isInteger(raw)&&raw>=1&&raw<=20?raw:2;setGuest({name:(params.get('invitado')||'Invitado de ejemplo').slice(0,120),passes});$('rsvp-info').textContent='Vista de prueba. Las respuestas todavía no se guardan.';$('submit').textContent='Probar confirmación';return}
$('submit').disabled=true;if(!id){$('rsvp-info').textContent='Para confirmar, abre el enlace personal que te compartieron los novios.';return}try{$('rsvp-info').textContent='Consultando tu invitación…';const data=await request(config.endpoint+'?'+new URLSearchParams({action:'guest',id}));if(!Number.isInteger(data.guest.passes)||data.guest.passes<1||data.guest.passes>20)throw Error('El pase no es válido.');setGuest(data.guest);$('rsvp-info').textContent=''}catch(e){$('rsvp-info').textContent=e.name==='AbortError'?'La consulta tardó demasiado. Recarga para intentar de nuevo.':e.message}}
loadGuest();
$('confirmation').addEventListener('submit',async e=>{e.preventDefault();const attendance=document.querySelector('[name=attendance]:checked').value;const name=$('name').value.trim();const people=attendance==='no'?0:Number($('people').value);if(!name){$('form-status').textContent='Escribe tu nombre.';return}if(!guest||!Number.isInteger(people)||people<0||people>guest.passes||(attendance==='yes'&&people<1)){$('form-status').textContent='Revisa el número de personas.';return}if(demo){$('form-status').textContent='Prueba completada. No se ha enviado ni guardado ninguna respuesta.';return}$('submit').disabled=true;$('form-status').textContent='Enviando…';try{await request(config.endpoint,{method:'POST',body:new URLSearchParams({id,name,attendance,people:String(people),wishes:$('wishes').value.trim()})});$('form-status').textContent=attendance==='yes'?'¡Gracias por confirmar! Nos encantará compartir este día contigo.':'Gracias por avisarnos y por ser parte de nuestra historia.';$('submit').textContent='Actualizar confirmación'}catch(err){$('form-status').textContent='No pudimos verificar el guardado. Puedes intentar de nuevo; tu respuesta se actualizará sin duplicarse.'}finally{$('submit').disabled=false}});
if('IntersectionObserver' in window){document.documentElement.classList.add('motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
})();
