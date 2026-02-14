/**
 * PUTYAHEARTINIT branded email templates
 * All emails use the PYHI visual identity: dark bg, gold accents, clean type
 */

const BRAND = {
  bg: '#0B1026',
  card: '#131A33',
  gold: '#D4A843',
  teal: '#4ECDC4',
  text: '#E8E0D5',
  muted: '#8A8A8A',
  font: "'Helvetica Neue', Arial, sans-serif",
  logo: 'https://putyaheartinit.github.io/putyaheartinit/images/pyhi-logo.png',
  shop: 'https://putyaheartinit.com',
  ig: 'https://instagram.com/putyaheartinit',
}

function wrapper(content) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:${BRAND.font};">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;letter-spacing:6px;color:${BRAND.gold};text-transform:uppercase;font-weight:600;">PUTYAHEARTINIT</div>
    </div>
    ${content}
    <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #1E2845;">
      <a href="${BRAND.ig}" style="color:${BRAND.muted};font-size:12px;text-decoration:none;margin:0 12px;">Instagram</a>
      <a href="${BRAND.shop}" style="color:${BRAND.muted};font-size:12px;text-decoration:none;margin:0 12px;">Shop</a>
      <p style="color:#555;font-size:11px;margin-top:16px;">Live. Love. Build.</p>
      <p style="color:#444;font-size:10px;">You're receiving this because you signed up at putyaheartinit.com<br>
      <a href="{{unsubscribe_url}}" style="color:#666;text-decoration:underline;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`
}

export const templates = {
  // ─── Day 0: Welcome ───
  welcome: (name) => ({
    subject: "You're In — Welcome to the Movement",
    html: wrapper(`
      <div style="background:${BRAND.card};border-radius:8px;padding:40px 32px;text-align:center;">
        <h1 style="color:${BRAND.text};font-size:28px;font-weight:300;margin:0 0 8px;letter-spacing:1px;">Welcome to PYHI</h1>
        <div style="width:40px;height:2px;background:${BRAND.gold};margin:16px auto;"></div>
        <p style="color:${BRAND.text};font-size:16px;line-height:1.8;margin:24px 0;">
          ${name ? `${name}, you` : 'You'} just joined something bigger than a brand.<br>
          This is a movement built on heart, hustle, and community.
        </p>
        <p style="color:${BRAND.gold};font-size:14px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin:32px 0 8px;">
          Live. Love. Build.
        </p>
        <p style="color:${BRAND.muted};font-size:14px;line-height:1.6;margin:24px 0;">
          Stay locked in — exclusive drops, early access, and content that feeds the soul are headed your way.
        </p>
        <a href="${BRAND.shop}" style="display:inline-block;margin-top:24px;padding:14px 40px;background:${BRAND.gold};color:${BRAND.bg};text-decoration:none;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-radius:4px;">Shop Now</a>
      </div>
    `)
  }),

  // ─── Day 3: Brand Story ───
  brand_story: (name) => ({
    subject: "The Story Behind the Heart",
    html: wrapper(`
      <div style="background:${BRAND.card};border-radius:8px;padding:40px 32px;">
        <h1 style="color:${BRAND.text};font-size:24px;font-weight:300;margin:0 0 24px;text-align:center;">The Story Behind the Heart</h1>
        <p style="color:${BRAND.text};font-size:15px;line-height:1.9;margin:0 0 16px;">
          ${name ? `${name},` : 'Hey,'} every brand starts somewhere. PUTYAHEARTINIT started with a simple belief:
        </p>
        <div style="border-left:3px solid ${BRAND.gold};padding:16px 24px;margin:24px 0;">
          <p style="color:${BRAND.gold};font-size:18px;font-style:italic;margin:0;line-height:1.6;">
            "If you put your heart into it — whatever 'it' is — you can't lose."
          </p>
        </div>
        <p style="color:${BRAND.text};font-size:15px;line-height:1.9;margin:16px 0;">
          Founded by Stevie Harts out of Atlanta, PYHI is where music meets fashion meets purpose. Every hoodie, every song, every event carries that energy.
        </p>
        <p style="color:${BRAND.text};font-size:15px;line-height:1.9;margin:16px 0;">
          We're not chasing trends. We're building a legacy. And now you're part of it.
        </p>
        <div style="text-align:center;margin-top:32px;">
          <a href="${BRAND.ig}" style="display:inline-block;padding:14px 40px;border:1px solid ${BRAND.gold};color:${BRAND.gold};text-decoration:none;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-radius:4px;">Follow the Journey</a>
        </div>
      </div>
    `)
  }),

  // ─── Day 7: Exclusive Offer ───
  exclusive_offer: (name) => ({
    subject: "Something Exclusive — Just for You",
    html: wrapper(`
      <div style="background:${BRAND.card};border-radius:8px;padding:40px 32px;text-align:center;">
        <p style="color:${BRAND.gold};font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px;">Family Only</p>
        <h1 style="color:${BRAND.text};font-size:28px;font-weight:300;margin:0 0 8px;">Your Exclusive Access</h1>
        <div style="width:40px;height:2px;background:${BRAND.gold};margin:16px auto;"></div>
        <p style="color:${BRAND.text};font-size:15px;line-height:1.8;margin:24px 0;">
          ${name ? `${name}, as` : 'As'} part of the PYHI family, you get first dibs on everything — drops, collabs, events.
        </p>
        <div style="background:${BRAND.bg};border:1px solid ${BRAND.gold};border-radius:8px;padding:32px;margin:32px 0;">
          <p style="color:${BRAND.gold};font-size:36px;font-weight:700;margin:0;">15% OFF</p>
          <p style="color:${BRAND.text};font-size:14px;margin:8px 0 0;">Your first order</p>
          <p style="color:${BRAND.gold};font-size:20px;letter-spacing:6px;font-weight:600;margin:16px 0 0;">HEART15</p>
        </div>
        <a href="${BRAND.shop}" style="display:inline-block;margin-top:16px;padding:14px 40px;background:${BRAND.gold};color:${BRAND.bg};text-decoration:none;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-radius:4px;">Shop the Collection</a>
        <p style="color:${BRAND.muted};font-size:12px;margin-top:24px;">Code expires in 7 days.</p>
      </div>
    `)
  }),

  // ─── New Drop Announcement ───
  new_drop: ({ title, description, image_url }) => ({
    subject: `New Drop — ${title}`,
    html: wrapper(`
      <div style="background:${BRAND.card};border-radius:8px;overflow:hidden;">
        ${image_url ? `<img src="${image_url}" alt="${title}" style="width:100%;display:block;">` : ''}
        <div style="padding:40px 32px;text-align:center;">
          <p style="color:${BRAND.gold};font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px;">Just Dropped</p>
          <h1 style="color:${BRAND.text};font-size:28px;font-weight:300;margin:0 0 16px;">${title}</h1>
          <p style="color:${BRAND.text};font-size:15px;line-height:1.8;margin:0 0 32px;">${description}</p>
          <a href="${BRAND.shop}" style="display:inline-block;padding:14px 40px;background:${BRAND.gold};color:${BRAND.bg};text-decoration:none;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-radius:4px;">Shop Now</a>
        </div>
      </div>
    `)
  }),
}

export default templates
