// Nouvelle version : charge des images locales et un fichier music.mp3 local
const thumbs = document.getElementById('thumbs');
const mainPhoto = document.getElementById('mainPhoto');
const displayName = document.getElementById('displayName');
const displayMessage = document.getElementById('displayMessage');
const startBtn = document.getElementById('startBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const confettiCanvas = document.getElementById('confetti-canvas');
const balloonContainer = document.getElementById('balloonContainer');
const heartLayer = document.getElementById('heartLayer');
const beginBtn = document.getElementById('beginBtn');
const startOverlay = document.getElementById('startOverlay');

// initial fallback list; will be replaced if images.json is available
let images = [
  'images/image1.jpg',
  'images/image2.jpg',
  'images/image3.jpg'
];

// Try to load images.json automatically to detect all images
fetch('images.json').then(r=>{
  if (!r.ok) throw new Error('no manifest');
  return r.json();
}).then(list=>{
  if (Array.isArray(list) && list.length) { images = list; buildThumbs(); }
}).catch(()=>{ /* keep fallback */ });

let slideIndex = 0;
let slideTimer = null;
let confettiInterval = null;
let balloons = [];
// Messages to show over slides (you can customize)
const messages = [
  "Maman, tu es mon premier amour et mon éternel refuge 💕",
  "Dans tes bras, j'ai trouvé la sécurité, dans ton sourire, la joie pure",
  "Tu m'as appris à aimer, à rêver, à croire en moi... Merci maman",
  "Chaque ride sur ton visage raconte une histoire d'amour inconditionnel",
  "Tu es ma héroïne silencieuse, ma source de force et d'inspiration",
  "Maman, tu es la plus belle des femmes, la plus douce des âmes",
  "Ton cœur généreux et ton amour infini font de toi une maman exceptionnelle",
  "Aujourd'hui, nous célébrons la femme la plus importante de ma vie",
  "Ta voix m’apaise, ton regard me rassure, ton amour me porte chaque jour",
  "Merci d’avoir fait de la maison un lieu de tendresse et de paix",
  "Je prie que Dieu te garde en santé et te comble de bonheur 🌷",
  "Tous mes succès portent la trace de tes sacrifices et de tes prières",
  "Si je souris aujourd’hui, c’est grâce à ton amour qui m’a construit",
  "Tu es mon exemple, ma force tranquille, ma douceur éternelle",
  "Qu’Allah te bénisse et t’accorde une longue vie remplie de joie 🤲",
  "Je t’aime plus que les mots ne peuvent le dire, maman ❤️"
];

// Build thumbs from local images (if they exist)
function buildThumbs(){
  thumbs.innerHTML='';
  images.forEach((src, idx)=>{
    const img = document.createElement('img'); img.src = src; img.alt = `photo ${idx+1}`;
    img.addEventListener('click', ()=> immediateShow(idx));
    thumbs.appendChild(img);
  });
  if (images.length) { mainPhoto.src = images[0]; mainPhoto.classList.add('zoomed'); }
}

buildThumbs();

function startShow(){
  if (!images.length) return;
  if (slideTimer){ clearInterval(slideTimer); slideTimer=null; if (startBtn) startBtn.textContent='Lire'; pauseMusic(); }
  else { 
    slideTimer = setInterval(()=> nextSlide(), 7000); 
    if (startBtn) startBtn.textContent='Pause'; 
    startConfetti(); 
    // Laisser apparaître l'image et le message avant les ballons
    setTimeout(()=> spawnBalloons(5), 1500);
    createHearts(12); 
    playMusicIfAvailable(); 
  }
}

function nextSlide(){ slideIndex = (slideIndex+1)%images.length; showSlide(slideIndex); }
function immediateShow(i){ slideIndex = i; showSlide(i); }

if (startBtn) startBtn.addEventListener('click', startShow);
if (fullscreenBtn) fullscreenBtn.addEventListener('click', ()=>{ if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); });

function showSlide(i){
  mainPhoto.classList.remove('zoomed');
  mainPhoto.style.opacity = 0;
  setTimeout(()=>{ 
    mainPhoto.src = images[i]; 
    
    // Ajuster la position de l'image pour optimiser l'affichage du visage
    mainPhoto.onload = function() {
      const img = this;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Si c'est un portrait (plus haut que large), centrer sur le haut
      if (aspectRatio < 1) {
        img.style.objectPosition = 'center top';
      } else {
        // Si c'est un paysage, centrer normalement
        img.style.objectPosition = 'center center';
      }
    };
    
    mainPhoto.style.opacity=1; 
    mainPhoto.classList.add('zoomed'); 
    createHearts(12);
    
    // show message corresponding to slide with beautiful animation
    const msgEl = document.getElementById('slideMessage');
    if (msgEl){ 
      msgEl.textContent = messages[i % messages.length]; 
      msgEl.style.opacity = '0'; 
      msgEl.style.transform = 'translate(-50%, -50%) scale(0.9)';
      msgEl.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      
      setTimeout(()=>{ 
        msgEl.style.opacity='1'; 
        msgEl.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 100); 
    }
  }, 260);
}

/* Canvas confetti */
const ctx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;
function resizeCanvas(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min }

function startConfetti(){ if (!ctx) return; const parts=[]; const colors=['#ff69b4','#ffb6c1','#dda0dd','#ffc0cb','#f0e6f0']; for(let i=0;i<160;i++){ parts.push({x:Math.random()*confettiCanvas.width,y:Math.random()*-confettiCanvas.height,w:8+Math.random()*12,h:10+Math.random()*12,vy:1+Math.random()*3,rot:Math.random()*360,vr:Math.random()*6,color:colors[randomInt(0,colors.length-1)]}); }
  confettiInterval = setInterval(()=>{ ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); for (let p of parts){ p.y += p.vy; p.rot += p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180); ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 10; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); if (p.y>confettiCanvas.height+40){ p.y=-20; p.x=Math.random()*confettiCanvas.width; } } }, 1000/60);
}

function stopConfetti(){ if (confettiInterval){ clearInterval(confettiInterval); confettiInterval=null; if (ctx) ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); } }

/* Balloons */
function spawnBalloons(n=5){
  clearBalloons();
  const cols = ['#ff69b4','#ffb6c1','#dda0dd','#ffc0cb','#f0e6f0'];
  for (let i=0;i<n;i++){
    const b=document.createElement('div');
    b.className='balloon';
    const size=40+Math.random()*40; // ballons plus petits
    b.style.width=size+'px';
    b.style.height=(size*1.25)+'px';
    // éviter le centre: privilégier les bords gauche/droit
    const leftBase = Math.random()<0.5 ? (5+Math.random()*25) : (70+Math.random()*25);
    b.style.left= leftBase+'%';
    // démarrer plus bas pour ne pas masquer au début
    b.style.top=(75+Math.random()*20)+'%';
    b.style.background=`linear-gradient(45deg, ${cols[randomInt(0,cols.length-1)]}, ${cols[randomInt(0,cols.length-1)]})`;
    b.style.opacity=0.85;
    b.style.boxShadow='0 3px 10px rgba(255,105,180,0.25)';
    const string=document.createElement('div');
    string.className='string';
    b.appendChild(string);
    balloonContainer.appendChild(b);
    balloons.push(b);
    animateBalloon(b);
  }
}
function animateBalloon(b){ const duration=8000+Math.random()*6000; const startLeft=parseFloat(b.style.left); const endLeft=startLeft+(Math.random()*20-10); const startTop=parseFloat(b.style.top); const endTop=-20-Math.random()*40; const start=performance.now(); function frame(t){ const p=Math.min(1,(t-start)/duration); const ease = p<0.5? (2*p*p) : (-1 + (4-2*p)*p); b.style.left=(startLeft+(endLeft-startLeft)*ease)+'%'; b.style.top=(startTop+(endTop-startTop)*p)+'%'; b.style.transform=`rotate(${Math.sin(p*10)*10}deg)`; if (p<1) requestAnimationFrame(frame); else b.remove(); } requestAnimationFrame(frame); }
function clearBalloons(){ for (const b of balloons) b.remove(); balloons=[]; }

/* Hearts */
function createHearts(count=12){ for (let i=0;i<count;i++){ const h=document.createElement('div'); h.className='heart'; const x=20+Math.random()*60; const y=60+Math.random()*30; h.style.left=x+'%'; h.style.top=y+'%'; const s=15+Math.random()*25; h.style.width=s+'px'; h.style.height=s+'px'; h.style.background='linear-gradient(45deg, #ff69b4, #ffb6c1)'; h.style.boxShadow='0 2px 10px rgba(255,105,180,0.4)'; heartLayer.appendChild(h); animateHeart(h); } }
function animateHeart(h){ const dur=2200+Math.random()*1600; const start=performance.now(); const sy=parseFloat(h.style.top); function f(t){ const p=(t-start)/dur; if (p>1){ h.remove(); return } h.style.top=(sy - p*80)+'%'; h.style.opacity=(1-p).toString(); h.style.transform=`translate(-50%,-50%) scale(${1 + p*0.6}) rotate(${p*40}deg)`; requestAnimationFrame(f); } requestAnimationFrame(f); }

// Audio handling: prefer built-in music.mp3; fallback to WebAudio pad
let audioEl = new Audio('music.mp3'); audioEl.loop = true; let audioAvailable = false;
audioEl.addEventListener('canplay', ()=>{ audioAvailable = true; });
audioEl.addEventListener('error', ()=>{ audioAvailable = false; });

let audioCtx = null; let masterGain = null;
function startMusicFallback(){ if (audioCtx) return; audioCtx = new (window.AudioContext||window.webkitAudioContext)(); masterGain = audioCtx.createGain(); masterGain.gain.value = 0.08; masterGain.connect(audioCtx.destination); const padOsc = audioCtx.createOscillator(); padOsc.type='sine'; const pg = audioCtx.createGain(); pg.gain.value = 0.06; padOsc.connect(pg); pg.connect(masterGain); padOsc.frequency.value = 220; padOsc.start(); const now = audioCtx.currentTime; const notes = [440, 554.37, 659.25, 880]; for (let i=0;i<32;i++){ const t = now + i*0.5; const o = audioCtx.createOscillator(); o.type='triangle'; o.frequency.value = notes[i%notes.length]; const g = audioCtx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t+0.02); g.gain.exponentialRampToValueAtTime(0.0001, t+0.45); o.connect(g); g.connect(masterGain); o.start(t); o.stop(t+0.5); } }

function playMusicIfAvailable(){ if (audioAvailable) audioEl.play().catch(()=>{}); else { try{ startMusicFallback(); }catch(e){} } }
function pauseMusic(){ if (audioAvailable) audioEl.pause(); else { if (audioCtx) audioCtx.suspend?.(); } }

// Begin button
beginBtn.addEventListener('click', ()=>{ 
  // Effet de disparition magique
  startOverlay.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
  startOverlay.style.opacity = '0';
  startOverlay.style.transform = 'scale(0.8)';
  
  setTimeout(() => {
    startOverlay.style.display='none'; 
    // Effet d'apparition du contenu principal
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(50px)';
    container.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    
    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
    
    playMusicIfAvailable(); 
    startShow(); 
  }, 1000);
});

// initial canvas size
resizeCanvas();


