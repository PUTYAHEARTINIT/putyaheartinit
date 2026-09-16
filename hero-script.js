/* ═══ HERO PARTICLES ═══ */
(function(){
  const c=document.getElementById('heroParticles');
  for(let i=0;i<30;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.top=Math.random()*100+'%';
    p.style.animationDelay=Math.random()*8+'s';
    p.style.animationDuration=(6+Math.random()*6)+'s';
    c.appendChild(p);
  }
})();

/* ═══ TYPEWRITER ON HERO TAGLINE ═══ */
(function(){
  const txt="Live, Love, and Build from the Heart";
  const el=document.getElementById('heroTagline');
  let i=0;
  el.style.opacity='1';
  el.style.animation='none';
  function type(){
    if(i<txt.length){el.textContent+=txt[i];i++;setTimeout(type,50)}
  }
  setTimeout(type,1400);
})();
