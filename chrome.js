/* ═══ PRELOADER ═══ */
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('preloader').classList.add('done'),1200);
});

/* ═══ CURSOR GLOW (desktop only) ═══ */
if(window.matchMedia('(pointer:fine)').matches){
  const glow=document.getElementById('cursorGlow');
  let mx=0,my=0,gx=0,gy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;glow.classList.add('active')});
  document.addEventListener('mouseleave',()=>glow.classList.remove('active'));
  (function glowLoop(){
    gx+=(mx-gx)*0.08;gy+=(my-gy)*0.08;
    glow.style.left=gx+'px';glow.style.top=gy+'px';
    requestAnimationFrame(glowLoop);
  })();
}

/* ═══ INTERSECTION OBSERVER — SCROLL REVEAL ═══ */
const obs=new IntersectionObserver(e=>{
  e.forEach(el=>{if(el.isIntersecting){el.target.classList.add('v');obs.unobserve(el.target)}});
},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%8)*0.04+'s';obs.observe(el)});

/* ═══ NAV SCROLL SHRINK ═══ */
let ticking=false;
window.addEventListener('scroll',()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      const nav=document.getElementById('mainNav');
      const backTop=document.getElementById('backTop');
      if(scrollY>60){nav.classList.add('scrolled')}else{nav.classList.remove('scrolled')}
      if(scrollY>window.innerHeight){backTop.classList.add('visible')}else{backTop.classList.remove('visible')}
      ticking=false;
    });
    ticking=true;
  }
});

/* ═══ BACK TO TOP ═══ */
document.getElementById('backTop').addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'});
});

/* ═══ FORM SUBMISSION ═══ */
const AUTOMATION_API = 'https://putyaheartinit-automation.vercel.app';

async function handleSubmit(e, f) {
  e.preventDefault();
  const b = f.querySelector('button');
  const input = f.querySelector('input');
  const email = input.value.trim();
  const origText = b.textContent;

  if (!email || !email.includes('@')) {
    b.textContent = 'Enter a valid email';
    b.style.background = '#ff4444';
    b.style.color = '#fff';
    setTimeout(() => { b.textContent = origText; b.style.background = ''; b.style.color = ''; }, 2000);
    return;
  }

  // Show loading state
  b.textContent = 'Joining...';
  b.style.opacity = '0.7';
  b.disabled = true;

  try {
    const res = await fetch(`${AUTOMATION_API}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: f.classList.contains('book-form') ? 'waitlist' : 'cta' }),
    });
    const data = await res.json();

    if (data.success) {
      b.textContent = '\u2726 YOU\'RE IN';
      b.style.background = '#4ECDC4';
      b.style.color = '#0B1026';
      b.style.opacity = '1';
      input.value = '';
    } else {
      throw new Error(data.error || 'Failed');
    }
  } catch (err) {
    // Graceful fallback — still show success UI so user isn't blocked
    console.warn('Automation API unreachable, storing locally:', err.message);
    b.textContent = '\u2726 YOU\'RE IN';
    b.style.background = '#4ECDC4';
    b.style.color = '#0B1026';
    b.style.opacity = '1';
    input.value = '';

    // Queue for retry when API is available
    try {
      const q = JSON.parse(localStorage.getItem('pyhi_queue') || '[]');
      q.push({ email, source: f.classList.contains('book-form') ? 'waitlist' : 'cta', ts: Date.now() });
      localStorage.setItem('pyhi_queue', JSON.stringify(q));
    } catch (_) {}
  }

  setTimeout(() => {
    b.textContent = origText;
    b.style.background = '';
    b.style.color = '';
    b.disabled = false;
  }, 3000);
}

// Retry queued submissions when API comes online
(async function retryQueue() {
  try {
    const q = JSON.parse(localStorage.getItem('pyhi_queue') || '[]');
    if (!q.length) return;
    const health = await fetch(`${AUTOMATION_API}/api/health`).then(r => r.ok);
    if (!health) return;
    for (const item of q) {
      await fetch(`${AUTOMATION_API}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(() => {});
    }
    localStorage.removeItem('pyhi_queue');
  } catch (_) {}
})();

/* ═══ MOBILE NAV ═══ */
const navToggle=document.getElementById('navToggle');
const mobileMenu=document.getElementById('mobileMenu');
function closeMenu(){
  navToggle.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow='';
}
navToggle.addEventListener('click',function(){
  const isOpen=this.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow=isOpen?'hidden':'';
});

/* ═══ ANIMATED COUNTERS ═══ */
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target;
      const target=parseInt(el.dataset.target);
      const duration=2000;
      const start=performance.now();
      function update(now){
        const elapsed=now-start;
        const progress=Math.min(elapsed/duration,1);
        const eased=1-Math.pow(1-progress,3);
        const current=Math.floor(eased*target);
        const suffix=el.dataset.suffix||'';
        el.textContent=current.toLocaleString()+suffix;
        if(progress<1)requestAnimationFrame(update);
        else el.textContent=target.toLocaleString()+suffix;
      }
      requestAnimationFrame(update);
      counterObs.unobserve(el);
    }
  });
},{threshold:0.5});
document.querySelectorAll('[data-target]').forEach(el=>counterObs.observe(el));

/* ═══ BUTTON RIPPLE EFFECT ═══ */
document.querySelectorAll('.btn-w,.btn-outline,.svc-btn,.nav-cta').forEach(btn=>{
  btn.addEventListener('click',function(e){
    const ripple=document.createElement('span');
    ripple.className='ripple';
    const rect=this.getBoundingClientRect();
    ripple.style.left=(e.clientX-rect.left)+'px';
    ripple.style.top=(e.clientY-rect.top)+'px';
    this.appendChild(ripple);
    setTimeout(()=>ripple.remove(),600);
  });
});

/* ═══ SMOOTH SCROLL FOR ALL ANCHORS ═══ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const target=document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// ===== MUSIC PLAYER (persistent bottom bar, every page) =====
document.addEventListener('DOMContentLoaded', function() {
  const ARTISTS = {
    pyhi:   'spotify:artist:76JsiboSu8vDS4URAcWqZF',
    stevie: 'spotify:artist:2AircrJUqm6rLTZXz5KfO2'
  };
  let currentArtist = 'pyhi';
  let isOpen = false;

  function buildIframe(uri) {
    return '<iframe src="https://open.spotify.com/embed/artist/' + uri.split(':')[2] +
           '?utm_source=generator&theme=0" frameborder="0" allowtransparency="true"' +
           ' allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"' +
           ' loading="lazy"></iframe>';
  }

  function openPlayer() {
    isOpen = true;
    document.getElementById('musicPrompt').style.display = 'none';
    const embed = document.getElementById('spotifyEmbed');
    embed.style.display = 'flex';
    document.getElementById('musicBar').classList.add('open');
    if (!document.getElementById('iframeWrap').innerHTML) {
      document.getElementById('iframeWrap').innerHTML = buildIframe(ARTISTS[currentArtist]);
    }
  }

  function closePlayer(e) {
    e.stopPropagation();
    isOpen = false;
    document.getElementById('musicPrompt').style.display = 'flex';
    document.getElementById('spotifyEmbed').style.display = 'none';
    document.getElementById('musicBar').classList.remove('open');
  }

  window.switchArtist = function(artist, e) {
    e.stopPropagation();
    if (artist === currentArtist) return;
    currentArtist = artist;
    document.getElementById('btnPYHI').classList.toggle('active', artist === 'pyhi');
    document.getElementById('btnStevie').classList.toggle('active', artist === 'stevie');
    document.getElementById('iframeWrap').innerHTML = buildIframe(ARTISTS[artist]);
  };

  document.getElementById('musicBar').addEventListener('click', function() {
    if (!isOpen) openPlayer();
  });

  document.getElementById('musicClose').addEventListener('click', closePlayer);

  // ===== YOUTUBE THUMBNAILS =====
  document.querySelectorAll('.sm-card').forEach(function(card) {
    var href = card.getAttribute('href') || '';
    var m = href.match(/(?:[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (!m) return;
    var thumb = card.querySelector('.sm-thumb');
    if (!thumb) return;
    thumb.innerHTML = '<img src="https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg" alt="" loading="lazy">';
  });
});
