import sys, os

def build(title, desc, section_files, out_file, extra_scripts=None, include_size_modal=False):
    base = os.path.dirname(__file__)
    head = open(os.path.join(base, '_head_template.txt')).read()
    head = head.replace('__TITLE__', title).replace('__DESC__', desc)
    nav = open(os.path.join(base, '_chrome_nav.html')).read()
    sections = ''
    for f in section_files:
        sections += open(os.path.join(base, '_sections', f)).read() + '\n'
    if include_size_modal:
        sections += open(os.path.join(base, '_size_modal_snippet.html')).read() + '\n'
    footer = open(os.path.join(base, '_sections', 'footer.html')).read()
    back_top = '<!-- BACK TO TOP -->\n<button class="back-top" id="backTop" aria-label="Back to top">&#8593;</button>\n'
    scripts = '<script src="chrome.js"></script>\n'
    if include_size_modal:
        scripts += '<script src="stripe_products_data.js"></script>\n<script src="shop-modal.js"></script>\n'
    for s in (extra_scripts or []):
        scripts += f'<script src="{s}"></script>\n'
    out = head + nav + sections + footer + back_top + scripts + '</body>\n</html>\n'
    with open(os.path.join(base, out_file), 'w') as fh:
        fh.write(out)
    print('wrote', out_file, len(out), 'bytes')

pages = [
    ("Shop", "Shop the full PUTYAHEARTINIT collection.", ["shop.html"], "shop.html", None, True),
    ("Find Desire", "An interactive hidden-heart hunt through the PUTYAHEARTINIT world.", ["waldo.html"], "desire.html", ["desire.js"], False),
    ("Studio", "Creative studio services from PUTYAHEARTINIT.", ["studio.html"], "studio.html", None, False),
    ("Community", "Social impact, NIL partnerships, and community voices.", ["impact.html","nil.html","voices.html"], "community.html", None, False),
    ("About", "The movement, the story, and the vision behind PUTYAHEARTINIT.", ["movement.html","about.html","vision.html","manifesto.html"], "about.html", None, False),
    ("Music", "PUTYAHEARTINIT and Stevie Harts discography.", ["discog.html","musichub.html"], "music.html", None, False),
    ("The Book", "Press, features, and the world of the book.", ["press.html","portal.html","drops.html"], "book.html", None, False),
    ("Join", "Join the PUTYAHEARTINIT movement.", ["join.html"], "join.html", None, False),
]

for title, desc, secs, out, extra, modal in pages:
    build(title, desc, secs, out, extra, modal)
