// ═══ FIND DESIRE — hidden-heart hunt ═══
// Five clickable "Desire" hearts are scattered across the panorama. Find
// all five to unlock the completion banner. Positions are percentages of
// the image's own width/height, so they track correctly however wide the
// panorama renders.
(function () {
  const layer = document.getElementById('desireLayer');
  const img = document.getElementById('waldoImg');
  if (!layer || !img) return;

  const SPOTS = [
    { x: 9,  y: 62 },
    { x: 24, y: 28 },
    { x: 46, y: 71 },
    { x: 68, y: 34 },
    { x: 91, y: 55 },
  ];

  let found = 0;
  const countEl = document.getElementById('desireCount');
  const completeEl = document.getElementById('desireComplete');

  function placeMarkers() {
    layer.innerHTML = '';
    layer.style.height = img.offsetHeight + 'px';
    SPOTS.forEach((spot, i) => {
      const dot = document.createElement('button');
      dot.className = 'desire-dot';
      dot.setAttribute('aria-label', 'Find Desire');
      dot.dataset.found = 'false';
      dot.style.cssText = `position:absolute;left:${spot.x}%;top:${spot.y}%;transform:translate(-50%,-50%);
        width:34px;height:34px;border-radius:50%;border:0;padding:0;cursor:pointer;pointer-events:auto;
        background:radial-gradient(circle,rgba(230,57,70,0.9) 0%,rgba(230,57,70,0.35) 55%,transparent 75%);
        box-shadow:0 0 0 0 rgba(230,57,70,0.6);animation:desirePulse 1.8s ease-in-out infinite;
        animation-delay:${i * 0.25}s;font-size:16px;display:flex;align-items:center;justify-content:center;z-index:5;`;
      dot.textContent = '❤';
      dot.addEventListener('click', () => onFind(dot));
      layer.appendChild(dot);
    });
  }

  function onFind(dot) {
    if (dot.dataset.found === 'true') return;
    dot.dataset.found = 'true';
    dot.style.animation = 'none';
    dot.style.pointerEvents = 'none';
    dot.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    dot.style.transform += ' scale(1.8)';
    dot.style.opacity = '0';
    found++;
    if (countEl) countEl.textContent = String(found);
    if (found >= SPOTS.length && completeEl) {
      completeEl.style.display = 'block';
      completeEl.style.animation = 'fadeInUp 0.6s ease both';
    }
  }

  // Inject the pulse keyframes once.
  if (!document.getElementById('desireKeyframes')) {
    const style = document.createElement('style');
    style.id = 'desireKeyframes';
    style.textContent = `
      @keyframes desirePulse {
        0%,100% { box-shadow:0 0 0 0 rgba(230,57,70,0.55); }
        50% { box-shadow:0 0 0 14px rgba(230,57,70,0); }
      }
      @keyframes fadeInUp {
        from { opacity:0; transform:translateY(12px); }
        to { opacity:1; transform:translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  if (img.complete) placeMarkers();
  else img.addEventListener('load', placeMarkers);
  window.addEventListener('resize', placeMarkers);
})();
