import os
base = os.path.dirname(__file__)

head = open(os.path.join(base, '_head_template.txt')).read()
head = head.replace('__TITLE__', 'Live, Love, and Build from the Heart').replace(
    '__DESC__', 'A movement bridging music, fashion, literature, film, and consciousness. Founded by Stevie Harts.')
# index.html keeps its richer original <title>/meta (og:, twitter:) — patch those back in.
head = head.replace(
    '<title>Live, Love, and Build from the Heart — PUTYAHEARTINIT</title>\n<meta name="description" content="A movement bridging music, fashion, literature, film, and consciousness. Founded by Stevie Harts.">',
    '''<title>PUTYAHEARTINIT Live, Love, and Build from the Heart</title>
<meta name="description" content="PUTYAHEARTINIT A movement bridging music, fashion, literature, film, and consciousness. Founded by Stevie Harts.">
<meta property="og:title" content="PUTYAHEARTINIT Live, Love, and Build from the Heart">
<meta property="og:description" content="A movement bridging music, fashion, literature, film, and consciousness. Founded by Stevie Harts.">
<meta property="og:image" content="https://putyaheartinit.com/images/pyhi-branding.png">
<meta property="og:url" content="https://putyaheartinit.com">
<meta property="og:type" content="website">
<meta property="og:site_name" content="PUTYAHEARTINIT">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@putyaheartinit">
<meta name="twitter:title" content="PUTYAHEARTINIT Live, Love, and Build from the Heart">
<meta name="twitter:description" content="A movement bridging music, fashion, literature, film, and consciousness. Founded by Stevie Harts.">
<meta name="twitter:image" content="https://putyaheartinit.com/images/pyhi-branding.png">''')

nav = open(os.path.join(base, '_chrome_nav.html')).read()

sections = ''
for f in ['hero.html', 'availnow.html', 'ticker.html', 'quiz.html', 'games.html']:
    sections += open(os.path.join(base, '_sections', f)).read() + '\n'
sections += open(os.path.join(base, '_size_modal_snippet.html')).read() + '\n'

footer = open(os.path.join(base, '_sections', 'footer.html')).read()
back_top = '<!-- BACK TO TOP -->\n<button class="back-top" id="backTop" aria-label="Back to top">&#8593;</button>\n'

scripts = (
    '<script src="chrome.js"></script>\n'
    '<script src="hero-script.js"></script>\n'
    '<script src="stripe_products_data.js"></script>\n'
    '<script src="shop-modal.js"></script>\n'
    '<script src="quiz-engine.js"></script>\n'
)

out = head + nav + sections + footer + back_top + scripts + '</body>\n</html>\n'
with open(os.path.join(base, 'index.html'), 'w') as fh:
    fh.write(out)
print('wrote index.html', len(out), 'bytes')
