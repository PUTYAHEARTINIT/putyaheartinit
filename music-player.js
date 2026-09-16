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
